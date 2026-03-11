import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/Authcontext";
import { Navigate, Outlet } from "react-router";

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex w-fit items-center gap-4">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="grid gap-2">
          <Skeleton className="h-4 w-37" />
          <Skeleton className="h-4 w-25" />
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
