import { useState } from "react";
import { Link } from "react-router-dom";
import CreatePost from "./CreatePost";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  const addPostHandler = (postData) => {
    setPosts((prevPosts) => {
      return [postData, ...prevPosts];
    });
  };

  return (
    <>
      <p>게시글~</p>
      <Link to="create-post">게시글 추가</Link>
      <ul>
        {posts.map((post) => {
          return (
            <li>
              <p>{post.title}</p>
              <p>{post.name}</p>
              <p>{post.content}</p>
            </li>
          );
        })}
      </ul>
      <CreatePost onAddPost={addPostHandler} />
    </>
  );
};

export default Posts;
