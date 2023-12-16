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
    .project({ title: 1, name: 1, content: 1 })
    .toArray();
  res.json(posts);
});

router.post("/posts", async (req, res) => {
  const postData = req.body;
  const newPost = {
    ...postData,
    id: Math.random().toString(),
  };

  const result = await db.getDb().collection("posts").insertOne(newPost);
  console.log(result);
  res.status(201).json({ message: "Success" });
  // res.redirect("/posts");
});

module.exports = router;
