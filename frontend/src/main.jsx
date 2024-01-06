import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import CreatePostPage, {
  action as createPostAction,
} from "./pages/CreatePostPage";
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import PostDetailsPage, {
  loader as postDetailsLoader,
} from "./pages/PostDetailsPage";
// import { loader as postsLoader } from "./components/Posts/Posts";
import PostsPage, { loader as postsLoader } from "./pages/PostsPage";
import ProfilePage from "./pages/ProfilePage";
import RootLayout from "./pages/RootLayout";
import SignupPage from "./pages/SignUpPage";

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
        action: createPostAction,
      },
      {
        path: "posts/:postId",
        element: <PostDetailsPage />,
        loader: postDetailsLoader,
      },
      { path: "signup", element: <SignupPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
