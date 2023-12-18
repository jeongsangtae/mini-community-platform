import { Link, useLoaderData } from "react-router-dom";

const Posts = () => {
  const posts = useLoaderData();

  return (
    <>
      <p>게시글~</p>
      {posts.length > 0 && (
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                {/* <p>{post.id}</p> */}
                <p>{post.title}</p>
                <p>{post.name}</p>
                <p>{post.content}</p>
                <p>{post.date}</p>
              </li>
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
