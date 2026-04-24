import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "./components/theme/theme-provider";
import router from "./routes/routes";
import { AuthProvider, useAuth } from "./context/Authcontext";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SocketProvider } from "./context/SocketContext";

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Initializing App...</div>;
  }
}

function App() {
  console.log("Backend URL is:", import.meta.env.VITE_API_URL);
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
        <SocketProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Toaster position="bottom-right" />
            <RouterProvider router={router} />
          </ThemeProvider>
        </SocketProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
