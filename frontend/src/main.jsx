import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { AuthContextProvier } from "./store/auth-context";
import "./index.css";
import { action as postFormAction } from "./components/Posts/PostForm";
import HomePage from "./pages/Homepage";
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
import AdminPostsPage, {
  loader as adminPostsLoader,
} from "./pages/AdminPostsPage";
import AdminPostDetailsPage, {
  loader as adminPostDetailsLoader,
  action as adminPostDeleteAction,
} from "./pages/AdminPostDetailsPage";
// import AdminCommentsLayout from "./pages/AdminCommentsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminHomePage from "./pages/AdminHomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "posts",
        element: <PostsPage />,
        loader: postsLoader,
      },
      {
        path: "posts/create-post",
        element: (
          <Authentication>
            <CreatePostPage />
          </Authentication>
        ),
        action: postFormAction,
      },
      {
        path: "posts/:postId",
        id: "post-detail",
        loader: postDetailsLoader,
        children: [
          {
            index: true,
            element: <PostDetailsPage />,
            action: postDeleteAction,
          },
          {
            path: "edit",
            element: (
              <Authentication>
                <PostEditPage />
              </Authentication>
            ),
            action: postFormAction,
          },
          { path: "no-access", element: <Authentication /> },
        ],
      },
      { path: "signup-success", element: <SignupSuccessPage /> },
      {
        path: "profile",
        element: (
          <Authentication>
            <ProfilePage />
          </Authentication>
        ),
      },
      // { path: "no-access", element: <Authentication /> },
    ],
  },
  {
    path: "/admin",
    id: "users-data",
    loader: adminUsersLoader,
    element: <AdminRootLayout />,
    children: [
      {
        index: true,
        path: "",
        element: (
          <AdminAuthentication>
            <AdminHomePage />
          </AdminAuthentication>
        ),
      },
      {
        path: "posts",
        element: (
          <AdminAuthentication>
            <AdminPostsPage />
          </AdminAuthentication>
        ),
        loader: adminPostsLoader,
      },
      {
        path: "posts/:postId",
        id: "admin-post-detail",
        element: <AdminPostDetailsPage />,
        loader: adminPostDetailsLoader,
        action: adminPostDeleteAction,
      },
      {
        path: "users",
        element: (
          <AdminAuthentication>
            <AdminUsersPage />
          </AdminAuthentication>
        ),
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvier>
    <RouterProvider router={router} />
  </AuthContextProvier>
);
