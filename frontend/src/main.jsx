import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import { action as postFormAction } from "./components/Posts/PostForm";
import HomePage from "./pages/Homepage";
import PostDetailsPage, {
  loader as postDetailsLoader,
  action as postDeleteAction,
} from "./pages/PostDetailsPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostEditPage from "./pages/PostEditPage";
import PostsPage, { loader as postsLoader } from "./pages/PostsPage";
import ProfilePage from "./pages/ProfilePage";
import RootLayout from "./pages/RootLayout";
import SignupSuccessPage from "./pages/SignupSuccessPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "posts",
        element: <PostsPage />,
        loader: postsLoader,
      },
      {
        path: "posts/create-post",
        element: <CreatePostPage />,
        action: postFormAction,
        loader: postsLoader,
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
          { path: "edit", element: <PostEditPage />, action: postFormAction },
        ],
      },
      { path: "signup-success", element: <SignupSuccessPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
