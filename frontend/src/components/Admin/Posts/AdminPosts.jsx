import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";

import AdminPost from "./AdminPost";
import AdminSearch from "./AdminSearch";
import Pagination from "../../Posts/PagiNation";
import LoadingIndicator from "../../UI/LoadingIndicator";
import AuthContext from "../../../store/auth-context";
import classes from "./AdminPosts.module.css";

const AdminPosts = () => {
  const authCtx = useContext(AuthContext);

  // URL 쿼리 매개변수(searchParams)를 관리
  const [searchParams, setSearchParams] = useSearchParams();

  // 게시글 관련 상태 관리
  const [posts, setPosts] = useState([]);
  const [countPosts, setCountPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [firstPageGroup, setFirstPageGroup] = useState(1);
  const [lastPageGroup, setLastPageGroup] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("title");

  // 서버에서 게시글 데이터 가져오기
  const fetchData = async (
    pageNumber,
    searchTerm = "",
    searchField = "title"
  ) => {
    authCtx.setIsLoading(true); // 로딩 상태 시작
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
      authCtx.setIsLoading(false); // 로딩 상태 종료
    }
  };

  // 페이지 변경 시 새로운 데이터 가져옴
  const paginationFetchData = async (pageNumber, searchTerm, searchField) => {
    const resData = await fetchData(pageNumber, searchTerm, searchField);

    setPosts(resData.posts);
    setTotalPages(resData.totalPages);
    setFirstPageGroup(resData.firstPageGroup);
    setLastPageGroup(resData.lastPageGroup);
    setCountPosts(resData.countPosts);
  };

  // 페이지 변경 함수
  const pageChangeHandler = (pageNum) => {
    setSearchParams({ page: pageNum, search: searchTerm, field: searchField });
    setPage(pageNum);
  };

  // 검색 함수
  const searchHandler = () => {
    setSearchParams({ page: 1, search: searchTerm, field: searchField });
    setPage(1);
  };

  // 컴포넌트가 마운트될 때와 searchParams가 변경될 때 데이터 가져옴
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
            {/* 전체 게시글 갯수를 보여줌 */}
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
              {/* 게시글이 없는 경우에만 표시 */}
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
            <AdminSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchField={searchField}
              setSearchField={setSearchField}
              onSearch={searchHandler}
            />
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            firstPageGroup={firstPageGroup}
            lastPageGroup={lastPageGroup}
            onPageChange={pageChangeHandler}
          />
        </div>
      )}
    </div>
  );
};

export default AdminPosts;
