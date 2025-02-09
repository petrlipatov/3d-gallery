import { authContext } from "@/shared/constants/contexts";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = observer(() => {
  const store = useContext(authContext);

  if (!store.isAuth) {
    console.log("Outlet НЕ авторизирован");
    return <Navigate to="/login" replace />;
  }
  console.log("Outlet авторизирован");
  return <Outlet />;
});

export default ProtectedRoute;
