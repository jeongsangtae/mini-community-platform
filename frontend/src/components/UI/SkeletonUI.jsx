import React from "react";
import ContentLoader from "react-content-loader";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// export const PostsSkeleton = ({ classes }) => {
//   return (
//     <>
//       <Skeleton height={40} width={100} className={classes.heading}></Skeleton>
//       <div className={classes["posts-item"]}>
//         <Skeleton count={5} height={30} />
//       </div>
//       <Skeleton count={5} height={30} className={classes.posts} />
//       {/* <Skeleton className={classes.posts}>
//         <Skeleton width={"50px"} />
//         <Skeleton width={"100px"} />
//       </Skeleton> */}
//     </>
//   );
// };

export const PostsSkeleton = (props) => {
  return (
    <ContentLoader
      speed={2}
      width={1200}
      height={700}
      viewBox="0 0 1200 700"
      backgroundColor="#000000"
      foregroundColor="#a4a4a4"
      {...props}
    >
      <rect x="15" y="20" rx="3" ry="3" width="64" height="31" />
      <rect x="15" y="150" rx="3" ry="3" width="410" height="16" />
      <rect x="15" y="200" rx="3" ry="3" width="410" height="16" />
      <rect x="15" y="250" rx="3" ry="3" width="410" height="16" />
      <rect x="15" y="300" rx="3" ry="3" width="410" height="16" />
      <rect x="15" y="350" rx="3" ry="3" width="410" height="16" />
      <rect x="15" y="400" rx="3" ry="3" width="410" height="16" />
    </ContentLoader>
  );
};
