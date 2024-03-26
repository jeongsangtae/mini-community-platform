import classes from "./NoAccess.module.css";
const NoAccess = () => {
  return (
    <div className={classes["no-access"]}>
      <h1>로그인이 필요합니다</h1>
      <p>로그인 하지 않은 사용자는 접근할 수 없습니다.</p>
    </div>
  );
};

export default NoAccess;
