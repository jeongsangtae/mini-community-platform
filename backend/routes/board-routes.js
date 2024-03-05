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

  const editPost = {
    title: titleInput,
    content: contentInput,
  };

  await db
    .getDb()
    .collection("posts")
    .updateOne({ postId }, { $set: editPost });

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

  // console.log(postId);

  const post = await db.getDb().collection("posts").findOne({ postId: postId });

  // console.log(post);

  await db.getDb().collection("posts").deleteOne({ postId: post.postId });

  // 게시글 삭제시 게시글 번호가 비어있지 않도록 삭제한 게시글 뒤에 있는 게시글의 번호들을 1씩 감소
  // 삭제한 게시글 뒤에 있는 게시글의 번호를 확인하기 위해 $gt를 사용해 번호가 더 큰 것을 확인해서 감소시킨다.
  await db
    .getDb()
    .collection("posts")
    .updateMany({ postId: { $gt: post.postId } }, { $inc: { postId: -1 } });

  res.status(200).json({ message: "Success" });
});

router.get("/posts/:postId/comments", async (req, res) => {
  let postId = parseInt(req.params.postId);

  const post = await db.getDb().collection("posts").findOne({ postId });

  const comments = await db
    .getDb()
    .collection("comments")
    .find({ post_id: post._id })
    .toArray();

  res.status(200).json({ comments });
});

router.post("/posts/:postId/comments", async (req, res) => {
  let postId = parseInt(req.params.postId);
  let date = new Date();

  const post = await db.getDb().collection("posts").findOne({ postId });

  const contentInput = req.body.content;

  // const processedData = contentInput.replace(/\n/g, "<br/>");

  // const processedData = contentInput
  //   .replace(/<br>/g, "")
  //   .replace(/\n/g, "<br>");

  // const processedData = escape(contentInput);

  const newComment = {
    post_id: post._id,
    // name: user.name,
    // email: user.email,
    // content: processedData,
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

  // console.log(comment);

  res.status(200).json({ newComment });
});

router.patch("/posts/:postId/comments", async (req, res) => {
  // let postId = parseInt(req.params.postId);
  let commentId = req.body.commentId;
  let date = new Date();

  commentId = new ObjectId(commentId);

  // const post = await db.getDb().collection("posts").findOne({ postId });

  const contentInput = req.body.content;

  let editComment = {
    _id: commentId,
    content: contentInput,
    date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`,
  };

  await db
    .getDb()
    .collection("comments")
    .updateOne({ _id: commentId }, { $set: editComment });

  res.status(200).json({ editComment });
});

router.delete("/posts/:postId/comment", async (req, res) => {
  // let postId = parseInt(req.params.postId);
  let commentId = req.body.commentId;

  console.log(commentId);

  commentId = new ObjectId(commentId);

  console.log(commentId);

  await db.getDb().collection("comments").deleteOne({ _id: commentId });

  res.status(200).json({ message: "Success" });
});

// router.get("/posts/:postId/replies", async (req, res) => {
//   let postId = parseInt(req.params.postId);

//   const post = await db.getDb().collection("posts").findOne({ postId });

//   const replies = await db
//     .getDb()
//     .collection("replies")
//     .find({ post_id: post._id })
//     .toArray();

//   console.log(replies);

//   res.status(200).json({ replies });
// });

router.get("/posts/:postId/replies/:commentId", async (req, res) => {
  let commentId = req.params.commentId;

  commentId = new ObjectId(commentId);

  console.log(commentId);

  const replies = await db
    .getDb()
    .collection("replies")
    .find({ comment_id: commentId })
    .toArray();

  console.log(replies);

  res.status(200).json({ replies });
});

router.post("/posts/:postId/replies", async (req, res) => {
  let postId = parseInt(req.params.postId);
  let commentId = req.body.commentId;
  let date = new Date();

  commentId = new ObjectId(commentId);

  const post = await db.getDb().collection("posts").findOne({ postId });

  const comment = await db
    .getDb()
    .collection("comments")
    .findOne({ _id: commentId });

  // const comment = await db
  //   .getDb()
  //   .collection("comments")
  //   .findOne({ commentId });

  const contentInput = req.body.content;

  const newReply = {
    post_id: post._id,
    comment_id: comment._id,
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

  await db.getDb().collection("replies").insertOne(newReply);

  res.status(200).json({ newReply });
});

router.patch("/posts/:postId/replies", async (req, res) => {
  // let postId = parseInt(req.params.postId);
  let replytId = req.body.replyId;
  let date = new Date();

  replytId = new ObjectId(replytId);

  // const post = await db.getDb().collection("posts").findOne({ postId });

  const contentInput = req.body.content;

  let editReply = {
    _id: replytId,
    content: contentInput,
    date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`,
  };

  await db
    .getDb()
    .collection("replies")
    .updateOne({ _id: replytId }, { $set: editReply });

  res.status(200).json({ editReply });
});

router.delete("/posts/:postId/replies", async (req, res) => {
  let replyId = req.body.replyId;

  console.log(replyId);

  replyId = new ObjectId(replyId);

  console.log(replyId);

  await db.getDb().collection("replies").deleteOne({ _id: replyId });

  res.status(200).json({ message: "Success" });
});

module.exports = router;
