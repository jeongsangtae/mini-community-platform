const express = require("express");
const mongodb = require("mongodb");
const jwt = require("jsonwebtoken");

const db = require("../data/database");
const { accessToken } = require("../middlewares/jwt-auth");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get("/admin/posts", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || "";
  const fields = (req.query.field || "").split(",");
  const pageSize = 5;
  const pageButtonSize = 5;

  let filter = {};

  if (search && fields.length) {
    filter = {
      $or: fields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
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

router.get("/admin/posts/:postId", async (req, res) => {
  let postId = parseInt(req.params.postId);

  const post = await db.getDb().collection("posts").findOne({ postId });

  res.json(post);
});

router.delete("/admin/posts/:postId", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let postId = parseInt(req.params.postId);

  const post = await db.getDb().collection("posts").findOne({ postId: postId });

  if (post) {
    await db.getDb().collection("replies").deleteMany({ post_id: post._id });

    await db.getDb().collection("comments").deleteMany({ post_id: post._id });

    await db.getDb().collection("posts").deleteOne({ postId: post.postId });

    await db
      .getDb()
      .collection("posts")
      .updateMany({ postId: { $gt: post.postId } }, { $inc: { postId: -1 } });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(403).json({ message: "게시글이 없습니다." });
  }
});

router.get("/admin/posts/:postId/comments", async (req, res) => {
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

router.delete("/admin/posts/:postId/comment", async (req, res) => {
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

  if (comment) {
    await db
      .getDb()
      .collection("replies")
      .deleteMany({ comment_id: commentId });

    await db.getDb().collection("comments").deleteOne({ _id: commentId });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(403).json({ message: "댓글이 없습니다." });
  }
});

router.get("/admin/posts/:postId/:commentId/replies", async (req, res) => {
  let commentId = req.params.commentId;

  commentId = new ObjectId(commentId);

  const replies = await db
    .getDb()
    .collection("replies")
    .find({ comment_id: commentId })
    .toArray();

  res.status(200).json({ replies });
});

router.delete("/admin/posts/:postId/reply", async (req, res) => {
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

  if (reply) {
    await db.getDb().collection("replies").deleteOne({ _id: replyId });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(403).json({ message: "답글이 없습니다.." });
  }
});

router.get("/admin/users", async (req, res) => {
  const users = await db
    .getDb()
    .collection("users")
    .find({ email: { $ne: "admin@admin.com" } })
    .sort({ _id: -1 })
    .toArray();

  res.status(200).json({ users });
});

router.delete("/admin/user", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  const userEmail = req.body.email;

  // 삭제하려는 사용자 계정 찾기
  const user = await db
    .getDb()
    .collection("users")
    .findOne({ email: userEmail });

  if (user) {
    // 삭제하려는 사용자가 작성한 댓글 찾기
    const findComments = await db
      .getDb()
      .collection("comments")
      .find({ email: user.email })
      .toArray();

    if (findComments.length > 0) {
      // 삭제하려는 댓글 _id 추출
      const deletedCommentIds = findComments.map((comment) => comment._id);

      await db
        .getDb()
        .collection("replies")
        .deleteMany({ comment_id: { $in: deletedCommentIds } });
    }

    // 삭제하려는 사용자가 작성한 게시글 찾기
    const findPosts = await db
      .getDb()
      .collection("posts")
      .find({ email: user.email })
      .toArray();

    if (findPosts.length > 0) {
      // 삭제하려는 게시글 _id 추출
      const deletedPostIds = findPosts.map((post) => post._id);

      // 각 게시글의 댓글과 답글 삭제
      // 두 번의 DB 호출로, 배열의 길이에 비례해서 DB 호출 횟수가 증가함
      // for (const postId of deletedPostIds) {
      //   await db.getDb().collection("replies").deleteMany({ post_id: postId });
      //   await db.getDb().collection("comments").deleteMany({ post_id: postId });
      // }

      // $in 연산자를 통해서 한 번의 호출로 문서를 한 번에 삭제
      await db
        .getDb()
        .collection("replies")
        .deleteMany({ post_id: { $in: deletedPostIds } });
      await db
        .getDb()
        .collection("comments")
        .deleteMany({ post_id: { $in: deletedPostIds } });

      await db.getDb().collection("posts").deleteMany({ email: user.email });

      // 게시글의 번호 재배열
      const allPosts = await db
        .getDb()
        .collection("posts")
        .find()
        .sort({ postId: 1 })
        .toArray();

      for (let i = 0; i < allPosts.length; i++) {
        const currentPost = allPosts[i];
        await db
          .getDb()
          .collection("posts")
          .updateOne({ _id: currentPost._id }, { $set: { postId: i + 1 } });
      }
    }

    // 사용자와 관리자가 나눈 모든 채팅 삭제
    await db
      .getDb()
      .collection("chatMessages")
      .deleteMany({ user_id: user._id });

    // 사용자가 작성한 모든 댓글, 답글 삭제
    await db.getDb().collection("replies").deleteMany({ email: user.email });
    await db.getDb().collection("comments").deleteMany({ email: user.email });

    // 사용자 삭제
    await db.getDb().collection("users").deleteOne({ email: user.email });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(403).json({ message: "사용자가 없습니다." });
  }
});

module.exports = router;
