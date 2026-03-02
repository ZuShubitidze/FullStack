import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "./components/theme/theme-provider";
import router from "./routes/routes";
import { AuthProvider } from "./context/Authcontext";

export const API_URL = import.meta.env.VITE_API_URL;

function App() {
  console.log("Backend URL is:", import.meta.env.VITE_API_URL);

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />,
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
