import { Routes, Route } from "react-router";
import { ViewportProvider } from "./providers/viewport-provider";
import { StoreProvider } from "./providers/store-provider";
import { Home } from "@/pages/home";
import { Admin } from "@/pages/admin";
import { Login } from "@/pages/login";
import { ProtectedRoute } from "@/components/protected-route";

export const App = () => {
  return (
    <ViewportProvider>
      <StoreProvider>
        <Routes>
          <Route index element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="login" element={<Login />} />
        </Routes>
      </StoreProvider>
    </ViewportProvider>
  );
};
