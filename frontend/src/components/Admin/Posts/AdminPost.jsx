import { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../../../store/auth-context";
import classes from "./AdminPost.module.css";

const AdminPost = ({ num, title, name, date, content, count }) => {
  const authCtx = useContext(AuthContext);

  const lines = content.split("\n"); // 게시글 내용에서 줄바꿈 기준으로 분할
  const linesToShow = 2; // 미리보기로 보여줄 줄 수
  // 미리보기로 보여줄 텍스트
  const truncatedText = lines.slice(0, linesToShow).join("\n");
  const moreLines = lines.length > linesToShow; // 더 많은 줄이 있는지 확인

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

        {/* 게시글 제목과 내용을 클릭하면 게시글 상세 페이지로 이동 */}
        <Link to={`/admin/posts/${num.toString()}`}>
          <div className={classes.title}>
            <span>제목</span>
            <p>{title}</p>
          </div>
          <div className={classes.content}>
            {/* 미리보기 내용과 더 많은 내용이 있을 경우 '...' 표시 */}
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
