import { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import classes from "./Post.module.css";

const Post = ({ num, title, name, date, content }) => {
  const authCtx = useContext(AuthContext);

  return (
    <>
      <li className={`${classes.post} ${classes[authCtx.themeClass]}`}>
        <Link to={`/posts/${num.toString()}`}>
          <div className={classes["info-wrap"]}>
            <p>{num}</p>
            {/* <span className={classes["bullet"]}></span> */}
            <span>{name}</span>
            {/* <span className={classes["bullet"]}></span> */}
            <span>{date}</span>
            {/* <span className={classes["bullet"]}></span> */}
            <span>조회</span>
          </div>
          <div className={classes.title}>
            <p>{title}</p>
          </div>
          <div className={classes.content}>
            <p>{content}</p>
          </div>
        </Link>
      </li>
      <p className={classes.underline}></p>
    </>
  );
};

export default Post;
