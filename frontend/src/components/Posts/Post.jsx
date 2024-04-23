import { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import classes from "./Post.module.css";

const Post = ({ num, title, name, date, content }) => {
  const authCtx = useContext(AuthContext);

  const lines = content.split("\n");
  const linesToShow = 2;
  const truncatedText = lines.slice(0, linesToShow).join("\n");
  const moreLines = lines.length > linesToShow;

  return (
    <>
      <div className={classes.postWrapper}>
        <li className={`${classes.post} ${classes[authCtx.themeClass]}`}>
          <div className={classes["info-wrap"]}>
            <p>{num}</p>
            <span>{name}</span>
            <span>{date}</span>
            <span>조회</span>
          </div>
          <Link to={`/posts/${num.toString()}`}>
            <div className={classes.title}>
              <p>{title}</p>
            </div>
            <div className={classes.content}>
              <p>
                {truncatedText} {moreLines && "..."}
              </p>
            </div>
          </Link>
        </li>
      </div>
      <p className={classes.underline}></p>
    </>
  );
};

export default Post;
