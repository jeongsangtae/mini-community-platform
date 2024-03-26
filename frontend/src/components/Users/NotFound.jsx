import { Link } from "react-router-dom";

import classes from "./NotFound.module.css";

const NotFound = () => {
  return (
    <>
      <h1>404 페이지</h1>
      <Link to="/" className={classes["redirect-button"]}>
        <p>홈으로 이동</p>
      </Link>
    </>
  );
};

export default NotFound;
