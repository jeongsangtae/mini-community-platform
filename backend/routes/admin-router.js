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
