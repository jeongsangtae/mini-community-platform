import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { AuthContextProvider } from "./store/auth-context";
import { UIContextProvider } from "./store/ui-context";
import "./index.css";
import { action as postFormAction } from "./components/Posts/PostForm";
import HomePage from "./pages/HomePage";
import PostDetailsPage, {
  loader as postDetailsLoader,
  action as postDeleteAction,
} from "./pages/PostDetailsPage";
import PostsPage, { loader as postsLoader } from "./pages/PostsPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostEditPage from "./pages/PostEditPage";
import ProfilePage from "./pages/ProfilePage";
import RootLayout from "./pages/RootLayout";
import SignupSuccessPage from "./pages/SignupSuccessPage";
import Authentication from "./components/Users/Authentication";
import NotFound from "./components/Users/NotFound";
import AdminAuthentication from "./components/Admin/Auth/AdminAuthentication";
import AdminRootLayout, {
  loader as adminUsersLoader,
} from "./pages/AdminRootLayout";
import AdminHomePage from "./pages/AdminHomePage";
import AdminPostsPage, {
  loader as adminPostsLoader,
} from "./pages/AdminPostsPage";
import AdminPostDetailsPage, {
  loader as adminPostDetailsLoader,
  action as adminPostDeleteAction,
} from "./pages/AdminPostDetailsPage";
import AdminUsersPage from "./pages/AdminUsersPage";

// 라우터 설정: 각 경로에 대한 컴포넌트, loader, action 등을 정의
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // 메인 레이아웃 컴포넌트
    errorElement: <NotFound />, // 각 라우트에서 발생하는 에러를 처리 (ex. loader)
    children: [
      { index: true, element: <HomePage /> }, // 홈 페이지
      {
        path: "posts",
        element: <PostsPage />, // 게시글 목록 페이지
        loader: postsLoader, // 게시글 데이터를 가져오는 loader
      },
      {
        path: "posts/create-post",
        element: (
          <Authentication>
            <CreatePostPage />
          </Authentication>
        ), // 인증이 필요한 게시글 추가 페이지
        action: postFormAction, // 게시글 추가, 수정 action
      },
      {
        path: "posts/:postId",
        id: "post-detail", // 게시글 세부 페이지의 useRouteLoaderData에 사용될 routeId 내용
        loader: postDetailsLoader, // 게시글 세부 정보 loader
        children: [
          {
            index: true,
            element: <PostDetailsPage />, // 게시글 세부 정보 페이지
            action: postDeleteAction, // 게시글 삭제 action
          },
          {
            path: "edit",
            element: (
              <Authentication>
                <PostEditPage />
              </Authentication>
            ), // 인증이 필요한 게시글 수정 페이지
            action: postFormAction, // 게시글 수정 action
          },
          // { path: "no-access", element: <Authentication /> }, // 접근 권한 없음 페이지 (필요 시 활성화)
        ],
      },
      { path: "signup-success", element: <SignupSuccessPage /> }, // 회원가입 성공 페이지
      {
        path: "profile",
        element: (
          <Authentication>
            <ProfilePage />
          </Authentication>
        ), // 인증이 필요한 프로필 페이지
      },
    ],
  },
  {
    path: "/admin",
    id: "users-data", // 관리자 페이지의 채팅, 사용자 페이지 useRouteLoaderData에 사용될 routeId 내용
    loader: adminUsersLoader, // 관리자 페이지에서 사용자 데이터를 가져오는 loader
    element: <AdminRootLayout />, // 관리자 페이지 레이아웃 컴포넌트
    errorElement: <NotFound />, // 각 라우트에서 발생하는 에러를 처리 (ex. loader)
    children: [
      {
        index: true,
        path: "",
        element: (
          <AdminAuthentication>
            <AdminHomePage />
          </AdminAuthentication>
        ), // 인증이 필요한 관리자 홈 페이지
      },
      {
        path: "posts",
        element: (
          <AdminAuthentication>
            <AdminPostsPage />
          </AdminAuthentication>
        ), // 인증이 필요한 관리자 게시글 페이지
        loader: adminPostsLoader, // 관리자 페이지에서 게시글 데이터를 가져오는 로더
      },
      {
        path: "posts/:postId",
        id: "admin-post-detail", // 관리자 페이지의 게시글 세부 페이지 useRouteLoaderData에 사용될 routeId 내용
        element: <AdminPostDetailsPage />, // 관리자 페이지에서 게시글 세부 정보 가져옴
        loader: adminPostDetailsLoader, // 관리자 페이지에서 게시글 세부 정보를 가져오는 loader
        action: adminPostDeleteAction, // 관리자 페이지에서 게시글 삭제 action
      },
      {
        path: "users",
        element: (
          <AdminAuthentication>
            <AdminUsersPage />
          </AdminAuthentication>
        ), // 인증이 필요한 관리자 사용자 페이지
      },
    ],
  },
  // 정의되지 않은 모든 경로에 대해 NotFound 컴포넌트를 렌더링
  { path: "*", element: <NotFound /> }, // 404 페이지 (경로가 없을 때 표시)
]);

// React 앱의 진입점: 루트 엘리먼트를 생성하고, AuthContextProvider로 앱을 감쌈
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <UIContextProvider>
      <RouterProvider router={router} />
    </UIContextProvider>
  </AuthContextProvider>
);
