import { authContext } from "@/shared/constants/contexts";
import { observer } from "mobx-react-lite"; // Правильный импорт
import { FormEvent, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router";
import s from "./Login.module.css";

const LoginComponent = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const store = useContext(authContext);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, [store]);

  if (store.isAuth) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className={s.page}>
      <form
        name="login"
        onSubmit={(e: FormEvent<HTMLFormElement>): void => {
          e.preventDefault();
          store.login(email, password);
        }}
        className={s.form}
      >
        <div className={s.inputContainer}>
          <label htmlFor="password" className={s.label}>
            Email:
          </label>
          <input
            placeholder="Email"
            type="email"
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
            className={s.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="on"
            required
          />
        </div>
        <button
          className={s.button}
          type="submit"
          // disabled={status === "loading"}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export const Login = observer(LoginComponent);
