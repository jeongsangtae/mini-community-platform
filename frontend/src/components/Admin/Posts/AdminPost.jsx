import { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../../../store/auth-context";
import classes from "./AdminPost.module.css";

const AdminPost = ({ num, title, name, date, content, count }) => {
  const authCtx = useContext(AuthContext);

  const lines = content.split("\n");
  const linesToShow = 2;
  const truncatedText = lines.slice(0, linesToShow).join("\n");
  const moreLines = lines.length > linesToShow;

  return (
    <li className={classes["post-wrapper"]}>
      <div className={`${classes.post} ${classes[authCtx.themeClass]}`}>
        <div
          className={`${classes["info-wrap"]} ${classes[authCtx.themeClass]}`}
        >
          <p>{num}</p>
          <span>{name}</span>
          <span>{date}</span>
          <span>조회 {count}</span>
        </div>

        <Link to={`/admin/posts/${num.toString()}`}>
          <div className={classes.title}>
            <span>제목</span>
            <p>{title}</p>
          </div>
          <div className={classes.content}>
            <p>
              {truncatedText} {moreLines && "..."}
            </p>
          </div>
        </Link>
      </div>
      <p className={`${classes.underline} ${classes[authCtx.themeClass]}`}></p>
    </li>
  );
};

export default AdminPost;
