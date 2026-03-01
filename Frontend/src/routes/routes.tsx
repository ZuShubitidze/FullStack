import { createBrowserRouter } from "react-router";
import Root from "./Root";
import ErrorBoundary from "@/components/ErrorBoundary";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { lazy } from "react";
import PostsPage from "@/pages/PostsPage";
import PostPage from "@/pages/PostPage";
import ProtectedRoutes from "./ProtectedRoutes";
import ProfilePage from "@/pages/ProfilePage";

const CreatePostPage = lazy(() => import("@/pages/CreatePostPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    ErrorBoundary: () => <ErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/posts", element: <PostsPage /> },
      { path: "/posts/:id", element: <PostPage /> },
      {
        element: <ProtectedRoutes />,
        // Protected Routes
        children: [
          { path: "/profile", element: <ProfilePage /> },
          { path: "/createPost", element: <CreatePostPage /> },
        ],
      },
    ],
  },
]);

export default router;
