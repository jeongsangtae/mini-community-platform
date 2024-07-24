const express = require("express");
const mongodb = require("mongodb");
const jwt = require("jsonwebtoken");

const db = require("../data/database");
const { accessToken } = require("../middlewares/jwt-auth");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/");
});

router.get("/posts", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || ""; // 검색어를 쿼리 파라미터에서 가져옴
  const fields = (req.query.field || "").split(",");
  const pageSize = 5;
  const pageButtonSize = 5;

  let filter = {};

  if (search && fields.length) {
    filter = {
      $or: fields.map((field) => ({
        [field]: { $regex: search, $options: "i" }, // 선택된 필드에서 검색어 찾기 (대소문자 구분 없음)
      })),
    };
  } else if (search) {
    filter = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    };
  }

  const posts = await db
    .getDb()
    .collection("posts")
    .find(filter)
    .sort({ postId: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .project({ postId: 1, title: 1, name: 1, content: 1, date: 1, count: 1 })
    .toArray();

  const countPosts = await db
    .getDb()
    .collection("posts")
    .countDocuments(filter);

  const totalPages = Math.ceil(countPosts / pageSize);

  const firstPageGroup =
    Math.ceil(page / pageButtonSize) * pageButtonSize - pageButtonSize + 1;
  const lastPageGroup = Math.min(
    firstPageGroup + pageButtonSize - 1,
    totalPages
  );

  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw new Error("로그인하지 않은 사용자");
    }

    const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
    const loginUserTokenData = jwt.verify(token, accessTokenKey);
    const loginUserDbData = await db
      .getDb()
      .collection("users")
      .findOne({ email: loginUserTokenData.userEmail });

    if (!loginUserDbData) throw new Error("존재하지 않는 사용자");

    const { password, ...othersData } = loginUserDbData;

    res.status(200).json({
      posts,
      countPosts,
      page,
      totalPages,
      firstPageGroup,
      lastPageGroup,
      // userData: othersData,
    });
  } catch (error) {
    // Token이 유효하지 않거나, 사용자 정보가 없는 경우에 대한 처리
    res.status(200).json({
      posts,
      countPosts,
      page,
      totalPages,
      firstPageGroup,
      lastPageGroup,
    });
  }
});

router.post("/posts", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  const lastPost = await db
    .getDb()
    .collection("posts")
    .findOne({}, { sort: { postId: -1 } });

  let postId = lastPost ? lastPost.postId + 1 : 1;
  let date = new Date();
  let count = 0;
  const postData = req.body;

  const newPost = {
    ...postData,
    postId,
    name: othersData.name,
    email: othersData.email,
    count: count,
    date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`,
  };

  const result = await db.getDb().collection("posts").insertOne(newPost);

  console.log(result);

  res.status(200).json({ message: "Success" });
});

router.get("/posts/:postId", async (req, res) => {
  let postId = parseInt(req.params.postId);

  const post = await db.getDb().collection("posts").findOne({ postId });

  res.json(post);
});

router.post("/posts/:postId/count", async (req, res) => {
  let postId = parseInt(req.params.postId);

  try {
    await db
      .getDb()
      .collection("posts")
      .updateOne({ postId: postId }, { $inc: { count: 1 } });
    res.status(200).json({ message: "조회 수 상승 성공" });
  } catch (error) {
    res.status(500).json({ message: "조회 수 상승 실패" });
  }
});

router.patch("/posts/:postId/edit", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let postId = parseInt(req.params.postId);

  const post = await db.getDb().collection("posts").findOne({ postId: postId });

  const titleInput = req.body.title;
  const contentInput = req.body.content;

  if (post.email === othersData.email) {
    const editPost = {
      title: titleInput,
      content: contentInput,
    };

    await db
      .getDb()
      .collection("posts")
      .updateOne({ postId }, { $set: editPost });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(403).json({ message: "게시글 수정할 권한이 없습니다." });
  }
});

router.delete("/posts/:postId/", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let postId = parseInt(req.params.postId);

  const post = await db.getDb().collection("posts").findOne({ postId: postId });

  if (post.email === othersData.email) {
    await db.getDb().collection("replies").deleteMany({ post_id: post._id });

    await db.getDb().collection("comments").deleteMany({ post_id: post._id });

    await db.getDb().collection("posts").deleteOne({ postId: post.postId });

    // 게시글 삭제시 게시글 번호가 비어있지 않도록 삭제한 게시글 뒤에 있는 게시글의 번호들을 1씩 감소
    // 삭제한 게시글 뒤에 있는 게시글의 번호를 확인하기 위해 $gt를 사용해 번호가 더 큰 것을 확인해서 감소시킨다.
    await db
      .getDb()
      .collection("posts")
      .updateMany({ postId: { $gt: post.postId } }, { $inc: { postId: -1 } });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(403).json({ message: "게시글 삭제할 권한이 없습니다." });
  }
});

router.get("/posts/:postId/comments", async (req, res) => {
  let postId = parseInt(req.params.postId);

  const post = await db.getDb().collection("posts").findOne({ postId });

  const comments = await db
    .getDb()
    .collection("comments")
    .find({ post_id: post._id })
    .toArray();

  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new Error("로그인하지 않은 사용자");
    }

    const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
    const loginUserTokenData = jwt.verify(token, accessTokenKey);
    const loginUserDbData = await db
      .getDb()
      .collection("users")
      .findOne({ email: loginUserTokenData.userEmail });

    if (!loginUserDbData) {
      throw new Error("존재하지 않는 사용자");
    }

    const { password, ...othersData } = loginUserDbData;

    res.status(200).json({ comments, userData: othersData });
  } catch (error) {
    // Token이 유효하지 않거나, 사용자 정보가 없는 경우에 대한 처리
    res.status(200).json({ comments });
  }
});

router.post("/posts/:postId/comments", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let postId = parseInt(req.params.postId);
  let date = new Date();

  const post = await db.getDb().collection("posts").findOne({ postId });

  const contentInput = req.body.content;

  const newComment = {
    post_id: post._id,
    name: othersData.name,
    email: othersData.email,
    content: contentInput,
    date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`,
  };

  await db.getDb().collection("comments").insertOne(newComment);

  res.status(200).json({ newComment });
});

router.patch("/posts/:postId/comments", async (req, res) => {
  // let postId = parseInt(req.params.postId);
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let commentId = req.body.commentId;
  let date = new Date();

  commentId = new ObjectId(commentId);

  const comment = await db
    .getDb()
    .collection("comments")
    .findOne({ _id: commentId });

  const contentInput = req.body.content;

  if (comment.email === othersData.email) {
    let editComment = {
      _id: commentId,
      content: contentInput,
      date: `${date.getFullYear()}.${
        date.getMonth() + 1
      }.${date.getDate()} ${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`,
    };

    await db
      .getDb()
      .collection("comments")
      .updateOne({ _id: commentId }, { $set: editComment });

    res.status(200).json({ editComment });
  } else {
    res.status(403).json({ message: "댓글을 수정할 권한이 없습니다." });
  }
});

router.delete("/posts/:postId/comment", async (req, res) => {
  // let postId = parseInt(req.params.postId);
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let commentId = req.body.commentId;

  commentId = new ObjectId(commentId);

  const comment = await db
    .getDb()
    .collection("comments")
    .findOne({ _id: commentId });

  if (comment.email === othersData.email) {
    await db
      .getDb()
      .collection("replies")
      .deleteMany({ comment_id: commentId });

    await db.getDb().collection("comments").deleteOne({ _id: commentId });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(403).json({ message: "댓글을 삭제할 권한이 없습니다." });
  }
});

router.get("/posts/:postId/:commentId/replies", async (req, res) => {
  let commentId = req.params.commentId;

  commentId = new ObjectId(commentId);

  const replies = await db
    .getDb()
    .collection("replies")
    .find({ comment_id: commentId })
    .toArray();

  res.status(200).json({ replies });
});

router.post("/posts/:postId/replies", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let postId = parseInt(req.params.postId);
  let commentId = req.body.commentId;
  let date = new Date();

  commentId = new ObjectId(commentId);

  const post = await db.getDb().collection("posts").findOne({ postId });

  const comment = await db
    .getDb()
    .collection("comments")
    .findOne({ _id: commentId });

  const contentInput = req.body.content;

  const newReply = {
    post_id: post._id,
    comment_id: comment._id,
    name: othersData.name,
    email: othersData.email,
    content: contentInput,
    date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`,
  };

  await db.getDb().collection("replies").insertOne(newReply);

  res.status(200).json({ newReply });
});

router.patch("/posts/:postId/replies", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let replyId = req.body.replyId;
  let date = new Date();

  replyId = new ObjectId(replyId);

  const reply = await db
    .getDb()
    .collection("replies")
    .findOne({ _id: replyId });

  const contentInput = req.body.content;

  if (reply.email === othersData.email) {
    let editReply = {
      _id: replyId,
      content: contentInput,
      date: `${date.getFullYear()}.${
        date.getMonth() + 1
      }.${date.getDate()} ${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`,
    };

    await db
      .getDb()
      .collection("replies")
      .updateOne({ _id: replyId }, { $set: editReply });

    res.status(200).json({ editReply });
  } else {
    res.status(403).json({ message: "답글을 수정할 권한이 없습니다." });
  }
});

router.delete("/posts/:postId/reply", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let replyId = req.body.replyId;

  replyId = new ObjectId(replyId);

  const reply = await db
    .getDb()
    .collection("replies")
    .findOne({ _id: replyId });

  if (reply.email === othersData.email) {
    await db.getDb().collection("replies").deleteOne({ _id: replyId });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(403).json({ message: "답글을 삭제할 권한이 없습니다." });
  }
});

module.exports = router;
