import { Link, useLoaderData } from "react-router-dom";
import Post from "./Post";

const Posts = () => {
  const posts = useLoaderData();

  return (
    <>
      <p>게시글~</p>
      {posts.length > 0 && (
        <ul>
          {posts.map((post) => {
            return (
              <Post
                key={post.id}
                num={post.id}
                title={post.title}
                name={post.name}
                content={post.content}
                date={post.date}
              />
            );
          })}
        </ul>
      )}
      <Link to="create-post">게시글 추가</Link>
    </>
  );
};

export default Posts;

// export const loader = async () => {
//   const response = await fetch("http://localhost:3000/posts");
//   const resData = await response.json();
//   return resData.posts;
// };
