const express = require("express");
const mongodb = require("mongodb");
const jwt = require("jsonwebtoken");

const db = require("../data/database");
const { accessToken } = require("../middlewares/jwt-auth");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

// 게시글 목록 조회 및 검색 + 페이지네이션 포함 라우트
router.get("/admin/posts", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // 페이지 번호, 기본값 1
  const search = req.query.search || ""; // 검색어, 기본값은 빈 문자열
  const fields = (req.query.field || "").split(","); // 검색할 필드, 기본값 빈 배열
  const pageSize = 5; // 한 페이지에 보여줄 게시글 수색
  const pageButtonSize = 5; // 페이지 버튼 그룹 크기

  let filter = {};

  // 특정 필드에서 검색어 필터링
  if (search && fields.length) {
    filter = {
      $or: fields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })),
    };
  } else if (search) {
    // 검색어만 있는 경우, 기본 필드로 검색
    filter = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    };
  }

  try {
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

    // 게시글 데이터와 페이지네이션 정보 반환
    res.status(200).json({
      posts,
      countPosts,
      page,
      totalPages,
      firstPageGroup,
      lastPageGroup,
    });
  } catch (error) {
    // 오류가 발생했을 때의 처리
    // 서버에서 게시글을 가져오는 중에 발생한 오류를 처리하고, 클라이언트에게 실패 메시지를 전송
    console.error("게시글을 가져오는 중 오류 발생:", error.message);
    res.status(500).json({
      error: "게시글을 불러오는 데 실패했습니다.",
    });
  }
});

// 특정 게시글을 가져오는 라우트
router.get("/admin/posts/:postId", async (req, res) => {
  let postId = parseInt(req.params.postId);

  const post = await db.getDb().collection("posts").findOne({ postId });

  res.json(post);
});

// 특정 게시글을 삭제하는 라우트
router.delete("/admin/posts/:postId", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let postId = parseInt(req.params.postId);

  const post = await db.getDb().collection("posts").findOne({ postId: postId });

  if (post) {
    // 게시글과 관련된 댓글 및 답글 삭제
    await db.getDb().collection("replies").deleteMany({ post_id: post._id });
    await db.getDb().collection("comments").deleteMany({ post_id: post._id });

    // 게시글 삭제
    await db.getDb().collection("posts").deleteOne({ postId: post.postId });

    // postId를 재정렬하여 연속적인 숫자로 유지
    // 게시글 삭제 후 postId 재정렬
    await db
      .getDb()
      .collection("posts")
      .updateMany({ postId: { $gt: post.postId } }, { $inc: { postId: -1 } });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(403).json({ message: "게시글이 없습니다." });
  }
});

// 특정 게시글에 대한 댓글을 가져오는 라우트
router.get("/admin/posts/:postId/comments", async (req, res) => {
  let postId = parseInt(req.params.postId);

  try {
    // 데이터베이스에서 해당 게시글 조회
    const post = await db.getDb().collection("posts").findOne({ postId });

    if (!post) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    // 해당 게시글의 댓글 목록 조회
    const comments = await db
      .getDb()
      .collection("comments")
      .find({ post_id: post._id })
      .toArray();

    // 댓글 목록과 함께 성공 응답 반환
    res.status(200).json({ comments });
  } catch (error) {
    // 서버에서 오류 발생 시, 오류 메시지와 함께 실패 응답 반환
    console.error("댓글을 가져오는 중 오류 발생:", error.message);
    res.status(500).json({ error: "댓글을 불러오는 데 실패했습니다." });
  }
});

// 댓글을 삭제하는 라우트
router.delete("/admin/posts/:postId/comment", async (req, res) => {
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

  if (comment) {
    // 댓글과 관련된 답글 삭제
    await db
      .getDb()
      .collection("replies")
      .deleteMany({ comment_id: commentId });

    // 댓글 삭제
    await db.getDb().collection("comments").deleteOne({ _id: commentId });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(403).json({ message: "댓글이 없습니다." });
  }
});

// 특정 댓글에 대한 답글을 가져오는 라우트
router.get("/admin/posts/:postId/:commentId/replies", async (req, res) => {
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

// 답글을 삭제하는 라우트
router.delete("/admin/posts/:postId/reply", async (req, res) => {
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

  if (reply) {
    // 답글 삭제
    await db.getDb().collection("replies").deleteOne({ _id: replyId });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(403).json({ message: "답글이 없습니다.." });
  }
});

// 관리자가 모든 사용자를 조회하는 라우트
router.get("/admin/users", async (req, res) => {
  const users = await db
    .getDb()
    .collection("users")
    .find({ email: { $ne: "admin@admin.com" } }) // 관리자 계정을 제외하고 찾기
    .sort({ _id: -1 })
    .toArray();

  res.status(200).json({ users });
});

// 특정 사용자를 삭제하는 라우트
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

      // 두 번의 DB 호출로, 배열의 길이에 비례해서 DB 호출 횟수가 증가함
      // for (const postId of deletedPostIds) {
      //   await db.getDb().collection("replies").deleteMany({ post_id: postId });
      //   await db.getDb().collection("comments").deleteMany({ post_id: postId });
      // }

      // 사용자가 작성한 게시글에 달린 댓글과 답글 삭제
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

    // 사용자가 작성한 모든 댓글, 답글 삭제 (다른 사용자의 게시글에 남긴 댓글, 답글 포함)
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
