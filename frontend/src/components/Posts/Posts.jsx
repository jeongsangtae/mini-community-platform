import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import Post from "./Post";
import Pagination from "./PagiNation";
import LoadingIndicator from "../UI/LoadingIndicator";
// import { PostsSkeleton } from "../UI/SkeletonUI";
import AuthContext from "../../store/auth-context";
import classes from "./Posts.module.css";

const Posts = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [firstPageGroup, setFirstPageGroup] = useState(1);
  const [lastPageGroup, setLastPageGroup] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async (pageNumber, searchQuery = "") => {
    authCtx.setIsLoading(true);
    // setTimeout(async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/posts?page=${pageNumber}&search=${searchQuery}`
      );
      const resData = await response.json();
      return resData;
    } finally {
      authCtx.setIsLoading(false);
    }
    // }, 2000);
  };

  const paginationFetchData = async (pageNumber, searchQuery = "") => {
    const resData = await fetchData(pageNumber, searchQuery);
    setPosts(resData.posts);
    setTotalPages(resData.totalPages);
    setFirstPageGroup(resData.firstPageGroup);
    setLastPageGroup(resData.lastPageGroup);
  };

  const onPageChange = (pageNum) => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    navigate(`/posts?page=${pageNum}&search=${search}`);
    console.log(pageNum);
    setPage(pageNum);
  };

  const searchHandler = () => {
    navigate(`/posts?page=1&search=${searchTerm}`);
    setPage(1);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    const page = parseInt(params.get("page")) || 1;
    setSearchTerm(search);
    setPage(page);
    paginationFetchData(page, search);
  }, [location.search]);

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
            <p>{posts.length}개의 글</p>
            <Link to="create-post" className={postAddButtonClass}>
              글쓰기
            </Link>
          </div>

          <p
            className={`${classes.underline} ${classes[authCtx.themeClass]}`}
          ></p>

          {/* <div
            className={`${classes["posts-item"]} ${
              classes[authCtx.themeClass]
            }`}
          >
            <p>번호</p>
            <p>제목</p>
            <p>글쓴이</p>
            <p>날짜</p>
          </div> */}

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
            <div
              className={`${classes["search-container"]} ${
                classes[authCtx.themeClass]
              }`}
            >
              <input
                type="text"
                className={classes["search-input"]}
                placeholder="게시글 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={searchHandler}>검색</button>
            </div>
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
