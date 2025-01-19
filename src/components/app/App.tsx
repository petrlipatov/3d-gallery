import { Routes, Route } from "react-router";
import { ViewportProvider } from "./providers/viewport-provider";
import { Home } from "@/pages/Home/Home";
import { Admin } from "@/pages/Admin/Admin";

export function App() {
  return (
    <ViewportProvider>
      <Routes>
        <Route index element={<Home />} />
        <Route path="admin" element={<Admin />} />
      </Routes>
    </ViewportProvider>
  );
}
