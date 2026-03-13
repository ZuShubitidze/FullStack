import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "./components/theme/theme-provider";
import router from "./routes/routes";
import { AuthProvider } from "./context/Authcontext";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  console.log("Backend URL is:", import.meta.env.VITE_API_URL);
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Toaster position="bottom-right" />
          <RouterProvider router={router} />,
        </ThemeProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
