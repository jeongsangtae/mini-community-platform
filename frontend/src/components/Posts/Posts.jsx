import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import CreatePost from "./CreatePost";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  const addPostHandler = (postData) => {
    setPosts((prevPosts) => {
      return [postData, ...prevPosts];
    });
  };

  const postss = useLoaderData();

  return (
    <>
      <p>게시글~</p>
      {postss.length > 0 && (
        <ul>
          {postss.map((post) => {
            return (
              <li>
                <p>{post.title}</p>
                <p>{post.name}</p>
                <p>{post.content}</p>
              </li>
            );
          })}
        </ul>
      )}
      <Link to="create-post">게시글 추가</Link>
      {/* <ul>
        {posts.map((post) => {
          return (
            <li>
              <p>{post.title}</p>
              <p>{post.name}</p>
              <p>{post.content}</p>
            </li>
          );
        })}
      </ul> */}
      {/* <CreatePost onAddPost={addPostHandler} /> */}
    </>
  );
};

export default Posts;

// export const loader = async () => {
//   const response = await fetch("http://localhost:3000/posts");
//   const resData = await response.json();
//   return resData.posts;
// };
