import { authContext } from "@/shared/constants/contexts";
import { observer } from "mobx-react-lite"; // Правильный импорт
import { FormEvent, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Loader } from "@/shared/ui/Loader";
import s from "./Login.module.css";
import { Button } from "@/shared/ui/Button";
import { Status } from "@/shared/constants/auth-store";

const LoginComponent = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const store = useContext(authContext);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    } else {
      store.setIsAuthChecking(false);
    }
  }, [store]);

  if (store.isAuth) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className={s.page}>
      {store.isAuthChecking ? (
        <Loader />
      ) : (
        <form
          name="login"
          onSubmit={(e: FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
            store.login(email, password);
          }}
          className={s.form}
        >
          <div className={s.inputContainer}>
            <label htmlFor="email" className={s.label}>
              Email:
            </label>
            <input
              placeholder="Email"
              type="email"
              id="email"
              className={s.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className={s.inputContainer}>
            <label htmlFor="password" className={s.label}>
              Password:
            </label>
            <input
              placeholder="Password"
              type="password"
              id="password"
              className={s.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="on"
              required
            />
          </div>
          <Button variant={"secondary"} className={s.button} type="submit">
            Login
          </Button>

          {store.status === Status.Error && (
            <p className={s.statusError}>{store.message}</p>
          )}
        </form>
      )}
    </div>
  );
};

export const Login = observer(LoginComponent);
