import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "./components/theme/theme-provider";
import router from "./routes/routes";
import { AuthProvider } from "./context/Authcontext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />,
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
