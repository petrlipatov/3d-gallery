import { authContext } from "@/shared/constants/contexts";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = observer(() => {
  const store = useContext(authContext);

  if (!store.isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
});
