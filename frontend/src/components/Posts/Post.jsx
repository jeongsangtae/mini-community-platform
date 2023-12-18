const Post = ({ num, title, name, content, date }) => {
  return (
    <li>
      <p>{num}</p>
      <p>{title}</p>
      <p>{name}</p>
      <p>{content}</p>
      <p>{date}</p>
    </li>
  );
};

export default Post;
