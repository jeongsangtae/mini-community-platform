import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Post from "../Posts/Post";
import Pagination from "../Posts/Pagination";
import AuthContext from "../../store/auth-context";
import classes from "./Profile.module.css";

const Profile = () => {
  const navigate = useNavigate;
  const authCtx = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [firstPageGroup, setFirstPageGroup] = useState(1);
  const [lastPageGroup, setLastPageGroup] = useState(1);
  const [user, setUser] = useState({});

  console.log(posts);

  const fetchData = async (pageNumber) => {
    const response = await fetch(
      `http://localhost:3000/profile?page=${pageNumber}`
    );
    const resData = await response.json();
    return resData;
  };

  const paginationFetchData = async (pageNumber) => {
    const resData = await fetchData(pageNumber);
    setPosts(resData.posts);
    setTotalPages(resData.totalPages);
    setFirstPageGroup(resData.firstPageGroup);
    setLastPageGroup(resData.lastPageGroup);
  };

  const onPageChange = (pageNum) => {
    navigate(`/profile?page=${pageNum}`);
    console.log(pageNum);
    setPage(pageNum);
  };

  useEffect(() => {
    paginationFetchData(page);
  }, [page]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/profile", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("네트워크 오류");
        }
        const resData = await response.json();
        setPosts(resData.posts);
        console.log(resData);
      } catch (error) {
        console.error("로그인 유지 불가능", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1 className={classes.heading}>
        {authCtx.userInfo?.email} 프로필 페이지
      </h1>
      <div className={classes["posts-item"]}>
        <p>번호</p>
        <p>제목</p>
        <p>글쓴이</p>
        <p>날짜</p>
      </div>
      {/* {posts.map((post) => {
        return (
          <>
            <p>{post.num}</p>
          </>
        );
      })} */}
      {/* {posts && (
        <ul className={classes.posts}>
          {posts.map((post) => {
            return (
              <li>
                {post.postId}
                {post.postId}
                {post.title}
                {post.name}
                {post.date}
              </li>
            );
          })}
        </ul>
      )} */}

      {posts && (
        <ul className={classes.posts}>
          {posts.map((post) => {
            return (
              <Post
                key={post.postId}
                num={post.postId}
                title={post.title}
                name={post.name}
                date={post.date}
              />
            );
          })}
        </ul>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        firstPageGroup={firstPageGroup}
        lastPageGroup={lastPageGroup}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default Profile;
