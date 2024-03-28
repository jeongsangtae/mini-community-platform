import classes from "./NoAccess.module.css";

const NoAccess = ({ checkWriter }) => {
  return (
    <div className={classes["no-access"]}>
      {checkWriter ? (
        <>
          <h1>로그인이 필요합니다</h1>
          <p>로그인 하지 않은 사용자는 접근할 수 없습니다.</p>
        </>
      ) : (
        <>
          <h1>접근 권한이 없습니다</h1>
          <p>해당 게시글을 작성한 사용자만 수정할 수 있습니다.</p>
        </>
      )}
    </div>
  );
};

export default NoAccess;
