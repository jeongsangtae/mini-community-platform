const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../data/database");
const {
  accessToken,
  refreshToken,
  refreshTokenExp,
} = require("../middlewares/jwt-auth");

const router = express.Router();

router.get("/admin/posts", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 5;
  const pageButtonSize = 5;

  const posts = await db
    .getDb()
    .collection("posts")
    .find({})
    .sort({ postId: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .project({ postId: 1, title: 1, name: 1, content: 1, date: 1, count: 1 })
    .toArray();

  const countPosts = await db.getDb().collection("posts").countDocuments({});
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
      page,
      totalPages,
      firstPageGroup,
      lastPageGroup,
      userData: othersData,
    });
  } catch (error) {
    console.error(error);
    // Token이 유효하지 않거나, 사용자 정보가 없는 경우에 대한 처리
    res
      .status(200)
      .json({ posts, page, totalPages, firstPageGroup, lastPageGroup });
  }
});

router.delete("/admin/posts", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let postId = parseInt(req.params.postId);

  // console.log(postId);

  const post = await db.getDb().collection("posts").findOne({ postId: postId });

  // console.log(post);

  if (post.email === othersData.email) {
    await db.getDb().collection("replies").deleteMany({ post_id: post._id });

    await db.getDb().collection("comments").deleteMany({ post_id: post._id });

    await db.getDb().collection("posts").deleteOne({ postId: post.postId });

    await db
      .getDb()
      .collection("posts")
      .updateMany({ postId: { $gt: post.postId } }, { $inc: { postId: -1 } });

    res.status(200).json({ message: "Success" });
  }
});

module.exports = router;
