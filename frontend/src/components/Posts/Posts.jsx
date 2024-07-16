import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Post from "./Post";
import Pagination from "./PagiNation";
import LoadingIndicator from "../UI/LoadingIndicator";
// import { PostsSkeleton } from "../UI/SkeletonUI";
import AuthContext from "../../store/auth-context";
import classes from "./Posts.module.css";

const Posts = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const authCtx = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [firstPageGroup, setFirstPageGroup] = useState(1);
  const [lastPageGroup, setLastPageGroup] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("title");

  const selectOptions = [
    { display: "제목", value: "title" },
    { display: "내용", value: "content" },
    { display: "이름", value: "name" },
  ];

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

  const paginationFetchData = async (pageNumber) => {
    const resData = await fetchData(pageNumber, searchTerm, searchField);
    setPosts(resData.posts);
    setTotalPages(resData.totalPages);
    setFirstPageGroup(resData.firstPageGroup);
    setLastPageGroup(resData.lastPageGroup);
  };

  const onPageChange = (pageNum) => {
    // navigate(
    //   `/posts?page=${pageNum}&search=${searchTerm}&field=${searchField}`
    // );
    setSearchParams({ page: pageNum, search: searchTerm, field: searchField });
    console.log(pageNum);
    setPage(pageNum);
  };

  const searchHandler = () => {
    // navigate(`/posts?page=1&search=${searchTerm}&field=${searchField}`);
    setSearchParams({ page: 1, search: searchTerm, field: searchField });
    setPage(1);
  };

  const fieldChangeHandler = (event) => {
    setSearchField(event.target.value);
  };

  useEffect(() => {
    // const params = new URLSearchParams(location.search);
    const search = searchParams.get("search") || "";
    const pageNumber = parseInt(searchParams.get("page")) || 1;
    const field = searchParams.get("field") || "title";

    setSearchTerm(search);
    setPage(pageNumber);
    setSearchField(field);
    paginationFetchData(page);
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
            <p>{posts.length}개의 글</p>
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
            <div
              className={`${classes["search-container"]} ${
                classes[authCtx.themeClass]
              }`}
            >
              <select value={searchField} onChange={fieldChangeHandler}>
                {selectOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.display}
                  </option>
                ))}
              </select>

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
