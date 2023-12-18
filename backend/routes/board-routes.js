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
  res.json(posts);
});

router.post("/posts", async (req, res) => {
  const lastPost = await db
    .getDb()
    .collection("posts")
    .findOne({}, { sort: { num: -1 } });

  let num = lastPost ? lastPost.num + 1 : 1;
  let date = new Date();
  const postData = req.body;

  const newPost = {
    ...postData,
    id: num,
    date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`,
  };

  const result = await db.getDb().collection("posts").insertOne(newPost);
  console.log(result);
  res.status(201).json({ message: "Success" });
  // res.redirect("/posts");
});

module.exports = router;
