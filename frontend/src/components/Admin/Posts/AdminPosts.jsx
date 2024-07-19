import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";

import AdminPost from "./AdminPost";
import Pagination from "../../Posts/PagiNation";
import LoadingIndicator from "../../UI/LoadingIndicator";
import AuthContext from "../../../store/auth-context";
import classes from "./AdminPosts.module.css";

const AdminPosts = () => {
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
    try {
      const searchParams = new URLSearchParams({
        page: pageNumber,
        search: searchTerm,
        field: searchField,
      }).toString();

      const response = await fetch(
        `http://localhost:3000/admin/posts?${searchParams}`
      );
      const resData = await response.json();
      return resData;
    } finally {
      authCtx.setIsLoading(false);
    }
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
    setPage(1);
    setSearchParams({ page: 1, search: searchTerm, field: searchField });
  };

  const fieldChangeHandler = (event) => {
    setSearchField(event.target.value);
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

          <div
            className={`${classes["last-menu"]} ${classes[authCtx.themeClass]}`}
          >
            <div
              className={`${classes["search-container"]} ${
                classes[authCtx.themeClass]
              }`}
            >
              <div
                className={`${classes["search-field"]} ${
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

                <div
                  className={`${classes["search-term-container"]} ${
                    classes[authCtx.themeClass]
                  }`}
                >
                  <input
                    type="text"
                    className={`${classes["search-term-input"]} ${
                      classes[authCtx.themeClass]
                    }`}
                    placeholder="게시글 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <IoIosSearch
                    onClick={searchHandler}
                    className={`${classes["search-term-icon"]} ${
                      classes[authCtx.themeClass]
                    }`}
                  />
                </div>
              </div>
            </div>
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

export default AdminPosts;
