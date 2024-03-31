import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const PostsSkeleton = ({ classes }) => {
  return (
    <>
      <Skeleton height={30} width={100} className={classes.heading}></Skeleton>
      <div className={classes["posts-item"]}>
        <Skeleton count={5} height={30} />
      </div>
      {/* <Skeleton className={classes.posts}>
        <Skeleton width={"50px"} />
        <Skeleton width={"100px"} />
      </Skeleton> */}
    </>
  );
};
