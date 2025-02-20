import { Routes, Route } from "react-router";
import { ViewportProvider } from "./providers/viewport-provider";
import { AuthProvider } from "./providers/auth-provider";
import { Home } from "@/pages/home";
import { Admin } from "@/pages/admin";
import { Login } from "@/pages/login";
import { ProtectedRoute } from "@/shared/ui/protected-route";

export function App() {
  return (
    <ViewportProvider>
      <AuthProvider>
        <Routes>
          <Route index element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </ViewportProvider>
  );
}
