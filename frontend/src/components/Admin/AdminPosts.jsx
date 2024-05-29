import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import AdminPost from "./AdminPost";
import Pagination from "../Posts/PagiNation";
import LoadingIndicator from "../UI/LoadingIndicator";
import AuthContext from "../../store/auth-context";
import classes from "./AdminPosts.module.css";

const AdminPosts = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [firstPageGroup, setFirstPageGroup] = useState(1);
  const [lastPageGroup, setLastPageGroup] = useState(1);

  const fetchData = async (pageNumber) => {
    authCtx.setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/admin/posts?page=${pageNumber}`
      );
      const resData = await response.json();
      return resData;
    } finally {
      authCtx.setIsLoading(false);
    }
  };

  const paginationFetchData = async (pageNumber) => {
    const resData = await fetchData(pageNumber);
    setPosts(resData.posts);
    setTotalPages(resData.totalPages);
    setFirstPageGroup(resData.firstPageGroup);
    setLastPageGroup(resData.lastPageGroup);
  };

  const onPageChange = (pageNum) => {
    navigate(`/admin/posts?page=${pageNum}`);
    console.log(pageNum);
    setPage(pageNum);
  };

  useEffect(() => {
    paginationFetchData(page);
  }, [page]);

  return (
    <div className={`${classes.background} ${classes[authCtx.themeClass]}`}>
      {authCtx.isLoading ? (
        <LoadingIndicator />
      ) : (
        <div className={classes["board-container"]}>
          <h1 className={`${classes.heading} ${classes[authCtx.themeClass]}`}>
            게시글
          </h1>

          <div
            className={`${classes["sub-menu"]} ${classes[authCtx.themeClass]}`}
          >
            <p>{posts.length}개의 글</p>
          </div>

          <p
            className={`${classes.underline} ${classes[authCtx.themeClass]}`}
          ></p>

          {posts.length > 0 ? (
            <ul className={classes.posts}>
              {posts.map((post) => {
                return (
                  <AdminPost
                    key={post.postId}
                    num={post.postId}
                    title={post.title}
                    name={post.name}
                    date={post.date}
                    content={post.content}
                    count={post.count}
                  />
                );
              })}
            </ul>
          ) : (
            <>
              <h2
                className={`${classes["no-posts"]} ${
                  classes[authCtx.themeClass]
                }`}
              >
                게시글이 존재하지 않습니다.
              </h2>
              <p
                className={`${classes.underline} ${
                  classes[authCtx.themeClass]
                }`}
              ></p>
            </>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            firstPageGroup={firstPageGroup}
            lastPageGroup={lastPageGroup}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AdminPosts;
