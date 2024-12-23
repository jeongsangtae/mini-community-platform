import { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Post from "./Post";
import Pagination from "./Pagination";
import Search from "./Search";
import LoadingIndicator from "../UI/LoadingIndicator";

import AuthContext from "../../store/auth-context";
import UIContext from "../../store/ui-context";
import classes from "./Posts.module.css";

const Posts = () => {
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

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
    searchField = "title",
    searchTerm = ""
  ) => {
    authCtx.setIsLoading(true); // 로딩 상태 시작
    // setTimeout(async () => {
    try {
      const searchParams = new URLSearchParams({
        page: pageNumber,
        field: searchField,
        search: searchTerm,
      }).toString();

      const response = await fetch(`${apiURL}/posts?${searchParams}`);

      if (!response.ok) {
        throw new Error("게시글 조회 실패");
      }

      const resData = await response.json();

      return resData;
    } catch (error) {
      authCtx.errorHelper(
        error,
        "게시글을 불러오는 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
      );
    } finally {
      authCtx.setIsLoading(false); // 로딩 상태 종료
    }
    // }, 2000);
  };

  // 페이지 변경 시 새로운 데이터 가져옴
  const paginationFetchData = async (pageNumber, searchField, searchTerm) => {
    const resData = await fetchData(pageNumber, searchField, searchTerm);

    setPosts(resData.posts);
    setTotalPages(resData.totalPages);
    setFirstPageGroup(resData.firstPageGroup);
    setLastPageGroup(resData.lastPageGroup);
    setCountPosts(resData.countPosts);
  };

  // 페이지 변경 함수
  const pageChangeHandler = (pageNum) => {
    setSearchParams({ page: pageNum, field: searchField, search: searchTerm });
    setPage(pageNum);
  };

  // 검색 함수
  const searchHandler = () => {
    setSearchParams({ page: 1, field: searchField, search: searchTerm });
    setPage(1);
  };

  // 컴포넌트가 마운트될 때와 searchParams가 변경될 때 데이터 가져옴
  useEffect(() => {
    const pageNumber = parseInt(searchParams.get("page")) || 1;
    const field = searchParams.get("field") || "title";
    const search = searchParams.get("search") || "";

    setPage(pageNumber);
    setSearchField(field);
    setSearchTerm(search);
    paginationFetchData(pageNumber, field, search);
  }, [searchParams]);

  // 계정 역할에 따라 다르게 표시되는 "글쓰기" 버튼 클래스 (비로그인, 관리자 계정은 동일한 취급)
  const postAddButtonClass =
    authCtx.userInfo?.role === "user"
      ? `${classes.add} ${classes[uiCtx.themeClass]}`
      : `${classes.add} ${classes[uiCtx.themeClass]} ${classes.opacity}`;

  return (
    <div
      className={`${classes.background} ${
        uiCtx.overlayOpen ? classes.hidden : ""
      } ${classes[uiCtx.themeClass]}`}
    >
      {authCtx.isLoading ? (
        <LoadingIndicator /> // 로딩 중일 때 표시
      ) : (
        <div className={classes["board-container"]}>
          {uiCtx.isDesktop ? (
            // 데스크탑 UI
            <>
              <h1 className={`${classes.heading} ${classes[uiCtx.themeClass]}`}>
                게시글
              </h1>

              <div
                className={`${classes["sub-menu"]} ${
                  classes[uiCtx.themeClass]
                }`}
              >
                {/* 전체 게시글 갯수를 보여줌 */}
                <p>
                  <span>{countPosts}</span>개의 글
                </p>
                <Link to="create-post" className={postAddButtonClass}>
                  글쓰기
                </Link>
              </div>
            </>
          ) : (
            // 모바일 UI
            <div
              className={`${classes["post-header"]} ${
                classes[uiCtx.themeClass]
              }`}
            >
              <p>
                <span>{countPosts}</span>개의 글
              </p>
              <h1 className={`${classes.heading} ${classes[uiCtx.themeClass]}`}>
                게시글
              </h1>
              <Link to="create-post" className={postAddButtonClass}>
                글쓰기
              </Link>
            </div>
          )}

          <p
            className={`${classes.underline} ${classes[uiCtx.themeClass]}`}
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
              {/* 게시글이 없는 경우에만 표시 */}
              <h2
                className={`${classes["no-posts"]} ${
                  classes[uiCtx.themeClass]
                }`}
              >
                게시글이 존재하지 않습니다.
              </h2>

              <p
                className={`${classes.underline} ${classes[uiCtx.themeClass]}`}
              ></p>
            </>
          )}

          <div
            className={`${classes["last-menu"]} ${classes[uiCtx.themeClass]}`}
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
            onPageChange={pageChangeHandler}
          />
        </div>
      )}
    </div>
  );
};

export default Posts;
