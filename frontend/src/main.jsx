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
import CreatePostPage from "./pages/CreatePostPage";
import PostEditPage from "./pages/PostEditPage";
import PostsPage, { loader as postsLoader } from "./pages/PostsPage";
import ProfilePage from "./pages/ProfilePage";
import RootLayout from "./pages/RootLayout";
import SignupSuccessPage from "./pages/SignupSuccessPage";
import Authentication from "./components/Users/Authentication";
import NotFound from "./components/Users/NotFound";

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
  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvier>
    <RouterProvider router={router} />
  </AuthContextProvier>
);
