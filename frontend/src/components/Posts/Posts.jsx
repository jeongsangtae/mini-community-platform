import { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Post from "./Post";
import Pagination from "./PagiNation";
import Search from "./Search";
import LoadingIndicator from "../UI/LoadingIndicator";
// import { PostsSkeleton } from "../UI/SkeletonUI";
import AuthContext from "../../store/auth-context";
import classes from "./Posts.module.css";

const Posts = () => {
  const authCtx = useContext(AuthContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [countPosts, setCountPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [firstPageGroup, setFirstPageGroup] = useState(1);
  const [lastPageGroup, setLastPageGroup] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("title");

  const fetchData = async (
    pageNumber,
    searchTerm = "",
    searchField = "title"
  ) => {
    authCtx.setIsLoading(true);
    // setTimeout(async () => {
    try {
      const searchParams = new URLSearchParams({
        page: pageNumber,
        search: searchTerm,
        field: searchField,
      }).toString();

      const response = await fetch(
        `http://localhost:3000/posts?${searchParams}`
      );
      const resData = await response.json();
      return resData;
    } finally {
      authCtx.setIsLoading(false);
    }
    // }, 2000);
  };

  const paginationFetchData = async (pageNumber, searchTerm, searchField) => {
    const resData = await fetchData(pageNumber, searchTerm, searchField);

    setPosts(resData.posts);
    setTotalPages(resData.totalPages);
    setFirstPageGroup(resData.firstPageGroup);
    setLastPageGroup(resData.lastPageGroup);
    setCountPosts(resData.countPosts);
  };

  const onPageChange = (pageNum) => {
    setSearchParams({ page: pageNum, search: searchTerm, field: searchField });
    setPage(pageNum);
  };

  const searchHandler = () => {
    setSearchParams({ page: 1, search: searchTerm, field: searchField });
    setPage(1);
  };

  useEffect(() => {
    const pageNumber = parseInt(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";
    const field = searchParams.get("field") || "title";

    setPage(pageNumber);
    setSearchTerm(search);
    setSearchField(field);
    paginationFetchData(pageNumber, search, field);
  }, [searchParams]);

  const postAddButtonClass = authCtx.isLoggedIn
    ? `${classes.add} ${classes[authCtx.themeClass]}`
    : `${classes.add} ${classes[authCtx.themeClass]} ${classes.opacity}`;

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
            <p>{countPosts}개의 글</p>
            <Link to="create-post" className={postAddButtonClass}>
              글쓰기
            </Link>
          </div>

          <p
            className={`${classes.underline} ${classes[authCtx.themeClass]}`}
          ></p>

          {posts.length > 0 ? (
            <ul className={classes.posts}>
              {posts.map((post) => {
                return (
                  <Post
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
          <div
            className={`${classes["last-menu"]} ${classes[authCtx.themeClass]}`}
          >
            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchField={searchField}
              setSearchField={setSearchField}
              onSearch={searchHandler}
            />
            <Link to="create-post" className={postAddButtonClass}>
              글쓰기
            </Link>
          </div>

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

export default Posts;
