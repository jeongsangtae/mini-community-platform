import { useLoaderData } from "react-router-dom";

const PostDetails = () => {
  const post = useLoaderData();

  if (!post) {
    // 데이터가 아직 로드되지 않은 경우 로딩 상태를 표시하거나 다른 처리를 수행할 수 있습니다.
    return <div>Loading...</div>;
  }

  return (
    <>
      <li>{post.content}</li>
    </>
  );
};

export default PostDetails;
