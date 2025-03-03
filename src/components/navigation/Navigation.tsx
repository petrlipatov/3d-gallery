import { Button } from "@/ui/button";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { storeContext } from "@/shared/constants/contexts";
import s from "./Navigation.module.css";

export const Navigation = ({ location }) => {
  const { authStore } = useContext(storeContext);

  const navigate = useNavigate();

  return (
    <>
      {location === "Home" ? (
        <Button
          className={s.logout2}
          onClick={() => navigate("/admin", { replace: true })}
        >
          Admin
        </Button>
      ) : (
        <Button
          className={s.logout2}
          onClick={() => navigate("/", { replace: true })}
        >
          Home
        </Button>
      )}
      <Button className={s.logout} onClick={() => authStore.logout()}>
        Logout
      </Button>
    </>
  );
};
