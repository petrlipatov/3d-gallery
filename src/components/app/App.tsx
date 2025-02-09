import { Routes, Route } from "react-router";
import { ViewportProvider } from "./providers/viewport-provider";
import { AuthProvider } from "./providers/auth-provider";
import { Home } from "@/pages/Home";
import { Admin } from "@/pages/Admin";
import { Login } from "@/pages/Login";

export function App() {
  return (
    <ViewportProvider>
      <AuthProvider>
        <Routes>
          <Route index element={<Home />} />
          <Route path="admin" element={<Admin />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </ViewportProvider>
  );
}
