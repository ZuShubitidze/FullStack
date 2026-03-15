import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import Root from "./Root";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import PostsPage from "@/pages/PostsPage";
import PostPage from "@/pages/PostPage";
import ProtectedRoutes from "./ProtectedRoutes";

const CreatePostPage = lazy(() => import("@/pages/CreatePostPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));

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
      // Protected Routes
      {
        element: <ProtectedRoutes />,
        children: [
          { path: "/profile", element: <ProfilePage /> },
          { path: "/createPost", element: <CreatePostPage /> },
        ],
      },
    ],
  },
]);

export default router;
