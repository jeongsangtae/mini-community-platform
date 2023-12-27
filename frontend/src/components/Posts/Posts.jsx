import { Link, useLoaderData } from "react-router-dom";
import PagiNation from "./PagiNation";

import Post from "./Post";
import classes from "./Posts.module.css";

const Posts = () => {
  const resData = useLoaderData();

  const posts = resData.posts;

  // const reversedPosts = posts.slice().reverse();

  return (
    <>
      <h1 className={classes.heading}>게시글</h1>
      <div className={classes["posts-item"]}>
        <p>번호</p>
        <p>제목</p>
        <p>글쓴이</p>
        <p>날짜</p>
      </div>
      {posts.length > 0 && (
        <ul className={classes.posts}>
          {posts.map((post) => {
            return (
              <Post
                key={post.postId}
                num={post.postId}
                title={post.title}
                name={post.name}
                date={post.date}
              />
            );
          })}
        </ul>
      )}
      <PagiNation />
      <Link to="create-post" className={classes.add}>
        <p>게시글 추가</p>
      </Link>
    </>
  );
};

export default Posts;

// export const loader = async () => {
//   const response = await fetch("http://localhost:3000/posts");
//   const resData = await response.json();
//   return resData.posts;
// };
