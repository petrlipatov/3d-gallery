import { storeContext } from "@/shared/constants/contexts";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = observer(() => {
  const { authStore } = useContext(storeContext);

  if (!authStore.isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
});
