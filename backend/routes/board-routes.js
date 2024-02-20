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
  res.status(200).json({ message: "Success" });
  // res.redirect("/posts");
});

router.get("/posts/:postId", async (req, res) => {
  let postId = parseInt(req.params.postId);
  // let postId = req.params.id;

  // postId = new ObjectId(postId);

  const post = await db.getDb().collection("posts").findOne({ postId });

  // console.log(typeof req.params.postId);
  // console.log(typeof postId);

  res.json(post);
});

// router.get("/posts/:postId/edit", async (req, res) => {});

router.patch("/posts/:postId/edit", async (req, res) => {
  let postId = parseInt(req.params.postId);

  const titleInput = req.body.title;
  const contentInput = req.body.content;

  const updateData = {
    title: titleInput,
    content: contentInput,
  };

  await db
    .getDb()
    .collection("posts")
    .updateOne({ postId }, { $set: updateData });

  console.log(postId);
  res.status(200).json({ message: "Success" });
});

// router.post("/posts/:postId/delete", async function (req, res) {
//   let postId = parseInt(req.params.postId);

//   console.log(postId);

//   const post = await db.getDb().collection("posts").findOne({ postId: postId });

//   console.log(post);

//   await db.getDb().collection("posts").deleteOne({ postId: post.postId });

//   // 게시글 삭제시 게시글 번호가 비어있지 않도록 삭제한 게시글 뒤에 있는 게시글의 번호들을 1씩 감소
//   // 삭제한 게시글 뒤에 있는 게시글의 번호를 확인하기 위해 $gt를 사용해 번호가 더 큰 것을 확인해서 감소시킨다.
//   await db
//     .getDb()
//     .collection("posts")
//     .updateMany({ postId: { $gt: post.postId } }, { $inc: { postId: -1 } });

//   res.status(200).json({ message: "Success" });
// });

router.delete("/posts/:postId/", async (req, res) => {
  let postId = parseInt(req.params.postId);

  console.log(postId);

  const post = await db.getDb().collection("posts").findOne({ postId: postId });

  console.log(post);

  await db.getDb().collection("posts").deleteOne({ postId: post.postId });

  // 게시글 삭제시 게시글 번호가 비어있지 않도록 삭제한 게시글 뒤에 있는 게시글의 번호들을 1씩 감소
  // 삭제한 게시글 뒤에 있는 게시글의 번호를 확인하기 위해 $gt를 사용해 번호가 더 큰 것을 확인해서 감소시킨다.
  await db
    .getDb()
    .collection("posts")
    .updateMany({ postId: { $gt: post.postId } }, { $inc: { postId: -1 } });

  res.status(200).json({ message: "Success" });
});

router.post("/posts/:postId/comments", async (req, res) => {
  let postId = parseInt(req.params.postId);
  let date = new Date();

  const post = await db.getDb().collection("posts").findOne({ postId });

  const contentInput = req.body.content;

  const newComment = {
    post_id: post._id,
    // name: user.name,
    // email: user.email,
    content: contentInput,
    date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`,
  };

  const result = await db.getDb().collection("comments").insertOne(newComment);

  console.log(result);

  res.status(200).json({ message: "Success" });
});

module.exports = router;
