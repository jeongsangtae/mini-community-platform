import { Link } from "react-router-dom";

const Post = ({ num, title, name, content, date }) => {
  return (
    <li>
      <Link to={num.toString()}>
        <p>{num}</p>
        <p>{title}</p>
        <p>{name}</p>
        <p>{content}</p>
        <p>{date}</p>
      </Link>
    </li>
  );
};

export default Post;
