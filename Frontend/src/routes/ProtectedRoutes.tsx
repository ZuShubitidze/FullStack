import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/Authcontext";
import { Navigate, Outlet } from "react-router";

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Skeleton>Loading...</Skeleton>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
