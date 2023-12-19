import { Link } from "react-router-dom";

const Post = ({ id, title, name, content, date }) => {
  return (
    <li>
      <Link to={id}>
        <p>{id}</p>
        <p>{title}</p>
        <p>{name}</p>
        <p>{content}</p>
        <p>{date}</p>
      </Link>
    </li>
  );
};

export default Post;
