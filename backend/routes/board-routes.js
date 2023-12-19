const express = require("express");
const mongodb = require("mongodb");

const db = require("../data/database");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/");
});

router.get("/posts", async (req, res) => {
  const posts = await db
    .getDb()
    .collection("posts")
    .find({})
    .project({ id: 1, title: 1, name: 1, content: 1, date: 1 })
    .toArray();
  res.send(posts);
});

router.post("/posts", async (req, res) => {
  const lastPost = await db
    .getDb()
    .collection("posts")
    .findOne({}, { sort: { id: -1 } });

  let id = lastPost ? lastPost.id + 1 : 1;
  let date = new Date();
  const postData = req.body;

  const newPost = {
    ...postData,
    id: id,
    date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`,
  };

  const result = await db.getDb().collection("posts").insertOne(newPost);
  console.log(result);
  res.status(201).json({ message: "Success" });
  // res.redirect("/posts");
});

router.get("/posts/:id", async (req, res) => {
  let postId = req.params.id;

  const post = await db.getDb().collection("posts").findOne({ id: postId });

  console.log(post);

  res.json(post);
});

module.exports = router;
