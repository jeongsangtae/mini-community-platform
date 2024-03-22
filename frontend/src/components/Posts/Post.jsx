import { Link } from "react-router-dom";

import classes from "./Post.module.css";

const Post = ({ num, title, name, date }) => {
  return (
    <>
      <li className={classes.post}>
        <Link to={`/posts/${num.toString()}`}>
          <p>{num}</p>
          <p>{title}</p>
          <p>{name}</p>
          <p>{date}</p>
        </Link>
      </li>
    </>
  );
};

export default Post;
