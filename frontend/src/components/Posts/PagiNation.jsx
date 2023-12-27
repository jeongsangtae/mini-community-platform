import { Link, useLoaderData } from "react-router-dom";

const Pagination = () => {
  const resData = useLoaderData();

  const posts = resData.posts;

  return (
    <>
      {posts.length > 0 && (
        <ul>
          {posts.map((post) => {
            return (
              <li>
                key={post.postId}
                num={post.postId}
                title={post.title}
                name={post.name}
                date={post.date}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default Pagination;
