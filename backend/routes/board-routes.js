const express = require("express");
const mongodb = require("mongodb");
const jwt = require("jsonwebtoken");

const db = require("../data/database");
const { accessToken } = require("../middlewares/jwt-auth");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

// 루트 URL 접근 시 메인 페이지로 리다이렉트
router.get("/", (req, res) => {
  res.redirect("/");
});

// 게시글 목록 조회 및 검색 + 페이지네이션 포함
router.get("/posts", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // 페이지 번호, 기본값 1
  const search = req.query.search || ""; // 검색어를 쿼리 파라미터에서 가져옴
  const fields = (req.query.field || "").split(","); // 검색할 필드 목록
  const pageSize = 5; // 한 페이지에 보여줄 게시글 수
  const pageButtonSize = 5; // 페이지 버튼 그룹 크기

  let filter = {};

  // 특정 필드에서 검색어 필터링
  if (search && fields.length) {
    filter = {
      $or: fields.map((field) => ({
        [field]: { $regex: search, $options: "i" }, // 선택된 필드에서 검색어 찾기 (대소문자 구분 없음)
      })),
    };
  } else if (search) {
    // 필드를 지정하지 않은 경우 모든 필드에서 검색
    filter = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    };
  }

  // 게시글 목록을 필터, 페이지네이션 및 정렬 기준에 따라 조회
  const posts = await db
    .getDb()
    .collection("posts")
    .find(filter)
    .sort({ postId: -1 }) // 최신 게시글부터 정렬
    .skip((page - 1) * pageSize) // 페이지네이션 처리
    .limit(pageSize)
    .project({ postId: 1, title: 1, name: 1, content: 1, date: 1, count: 1 })
    .toArray();

  // 총 게시글 수
  const countPosts = await db
    .getDb()
    .collection("posts")
    .countDocuments(filter);

  // 전체 게시글 수를 계산하여 페이지 수를 계산
  const totalPages = Math.ceil(countPosts / pageSize);

  // 페이지네이션의 시작과 끝 페이지 번호 계산
  // 페이지 그룹 계산
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

    // 액세스 토큰 검증
    const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
    const loginUserTokenData = jwt.verify(token, accessTokenKey);

    // 데이터베이스에서 사용자 정보 조회
    const loginUserDbData = await db
      .getDb()
      .collection("users")
      .findOne({ email: loginUserTokenData.userEmail });

    if (!loginUserDbData) throw new Error("존재하지 않는 사용자");

    const { password, ...othersData } = loginUserDbData;

    // 게시글 데이터와 페이지네이션 정보 반환
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

// 게시글 작성
router.post("/posts", async (req, res) => {
  const othersData = await accessToken(req, res); // 사용자 인증 정보 확인

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  // 가장 최근 게시글의 postId를 가져와서 새로운 postId 추가
  const lastPost = await db
    .getDb()
    .collection("posts")
    .findOne({}, { sort: { postId: -1 } });

  let postId = lastPost ? lastPost.postId + 1 : 1;
  let date = new Date();
  let count = 0;
  const postData = req.body;

  // 새 게시글 데이터 추가
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

// 특정 게시글 조회
router.get("/posts/:postId", async (req, res) => {
  let postId = parseInt(req.params.postId);

  const post = await db.getDb().collection("posts").findOne({ postId });

  res.json(post);
});

// 게시글 조회 수 증가
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

// 게시글 수정
router.patch("/posts/:postId/edit", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let postId = parseInt(req.params.postId);

  // 데이터베이스에서 해당 게시글 조회
  const post = await db.getDb().collection("posts").findOne({ postId: postId });

  const titleInput = req.body.title;
  const contentInput = req.body.content;

  // 게시글 작성자인지 확인 후 수정
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

// 게시글 삭제
router.delete("/posts/:postId/", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let postId = parseInt(req.params.postId);

  // 데이터베이스에서 해당 게시글 조회
  const post = await db.getDb().collection("posts").findOne({ postId: postId });

  if (post.email === othersData.email) {
    // 관련 답글 삭제
    await db.getDb().collection("replies").deleteMany({ post_id: post._id });
    // 관련 댓글 삭제
    await db.getDb().collection("comments").deleteMany({ post_id: post._id });
    // 게시글 삭제
    await db.getDb().collection("posts").deleteOne({ postId: post.postId });

    // 게시글 삭제시 게시글 번호가 비어있지 않도록 삭제한 게시글 뒤에 있는 게시글의 번호들을 1씩 감소
    // 삭제한 게시글 뒤에 있는 게시글의 번호를 확인하기 위해 $gt를 사용해 번호가 더 큰 것을 확인해서 감소시킨다.
    // 게시글 삭제 후 postId 재정렬
    await db
      .getDb()
      .collection("posts")
      .updateMany({ postId: { $gt: post.postId } }, { $inc: { postId: -1 } });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(403).json({ message: "게시글 삭제할 권한이 없습니다." });
  }
});

// 특정 게시글의 댓글 목록 조회
router.get("/posts/:postId/comments", async (req, res) => {
  let postId = parseInt(req.params.postId);

  // 데이터베이스에서 해당 게시글 조회
  const post = await db.getDb().collection("posts").findOne({ postId });

  // 해당 게시글의 댓글 목록 조회
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

// 댓글 작성
router.post("/posts/:postId/comments", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let postId = parseInt(req.params.postId);
  let date = new Date();

  // 데이터베이스에서 해당 게시글 조회
  const post = await db.getDb().collection("posts").findOne({ postId });

  const contentInput = req.body.content;

  // 새 댓글 데이터 생성
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

// 댓글 수정
router.patch("/posts/:postId/comments", async (req, res) => {
  // let postId = parseInt(req.params.postId);
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let commentId = req.body.commentId;
  let date = new Date();

  commentId = new ObjectId(commentId);

  // 해당 댓글 조회
  const comment = await db
    .getDb()
    .collection("comments")
    .findOne({ _id: commentId });

  const contentInput = req.body.content;

  // 댓글 작성자인지 확인 후 수정
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

// 댓글 삭제
router.delete("/posts/:postId/comment", async (req, res) => {
  // let postId = parseInt(req.params.postId);
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let commentId = req.body.commentId;

  commentId = new ObjectId(commentId);

  // 해당 댓글 조회
  const comment = await db
    .getDb()
    .collection("comments")
    .findOne({ _id: commentId });

  // 댓글 작성자인지 확인 후 삭제
  if (comment.email === othersData.email) {
    // 관련 답글 삭제
    await db
      .getDb()
      .collection("replies")
      .deleteMany({ comment_id: commentId });

    // 댓글 삭제
    await db.getDb().collection("comments").deleteOne({ _id: commentId });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(403).json({ message: "댓글을 삭제할 권한이 없습니다." });
  }
});

// 특정 댓글의 답글 목록 조회
router.get("/posts/:postId/:commentId/replies", async (req, res) => {
  let commentId = req.params.commentId;

  commentId = new ObjectId(commentId);

  // 해당 댓글의 답글 목록 조회
  const replies = await db
    .getDb()
    .collection("replies")
    .find({ comment_id: commentId })
    .toArray();

  res.status(200).json({ replies });
});

// 답글 작성
router.post("/posts/:postId/replies", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let postId = parseInt(req.params.postId);
  let commentId = req.body.commentId;
  let date = new Date();

  commentId = new ObjectId(commentId);

  // 데이터베이스에서 해당 게시글 조회
  const post = await db.getDb().collection("posts").findOne({ postId });

  // 해당 댓글 조회
  const comment = await db
    .getDb()
    .collection("comments")
    .findOne({ _id: commentId });

  const contentInput = req.body.content;

  // 새 답글 데이터 추가
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

// 답글 수정
router.patch("/posts/:postId/replies", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let replyId = req.body.replyId;
  let date = new Date();

  replyId = new ObjectId(replyId);

  // 해당 답글 조회
  const reply = await db
    .getDb()
    .collection("replies")
    .findOne({ _id: replyId });

  const contentInput = req.body.content;

  // 답글 작성자인지 확인 후 수정
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

// 답글 삭제
router.delete("/posts/:postId/reply", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let replyId = req.body.replyId;

  replyId = new ObjectId(replyId);

  // 해당 답글 조회
  const reply = await db
    .getDb()
    .collection("replies")
    .findOne({ _id: replyId });

  // 답글 작성자인지 확인 후 삭제
  if (reply.email === othersData.email) {
    await db.getDb().collection("replies").deleteOne({ _id: replyId });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(403).json({ message: "답글을 삭제할 권한이 없습니다." });
  }
});

module.exports = router;
