const express = require("express");
const mongodb = require("mongodb");

const db = require("../data/database");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/");
});

router.get("/posts", async (req, res) => {
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
    .project({ postId: 1, title: 1, name: 1, content: 1, date: 1 })
    .toArray();

  const countPosts = await db.getDb().collection("posts").countDocuments({});
  const totalPages = Math.ceil(countPosts / pageSize);

  const firstPageGroup =
    Math.ceil(page / pageButtonSize) * pageButtonSize - pageButtonSize + 1;
  const lastPageGroup = Math.min(
    firstPageGroup + pageButtonSize - 1,
    totalPages
  );
  res.json({ posts, page, totalPages, firstPageGroup, lastPageGroup });
});

router.post("/posts", async (req, res) => {
  const lastPost = await db
    .getDb()
    .collection("posts")
    .findOne({}, { sort: { postId: -1 } });

  let postId = lastPost ? lastPost.postId + 1 : 1;
  let date = new Date();
  const postData = req.body;

  const newPost = {
    ...postData,
    postId,
    date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`,
  };

  const result = await db.getDb().collection("posts").insertOne(newPost);
  console.log(result);
  res.status(201).json({ message: "Success" });
  // res.redirect("/posts");
});

router.get("/posts/:postId", async (req, res) => {
  let postId = parseInt(req.params.postId);
  // let postId = req.params.id;

  // postId = new ObjectId(postId);

  const post = await db.getDb().collection("posts").findOne({ postId });

  console.log(typeof req.params.postId);
  console.log(typeof postId);

  res.json(post);
});

module.exports = router;
