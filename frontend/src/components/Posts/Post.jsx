import { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import classes from "./Post.module.css";

const Post = ({ num, title, name, date }) => {
  const authCtx = useContext(AuthContext);

  return (
    <>
      <li className={`${classes.post} ${classes[authCtx.themeClass]}`}>
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
