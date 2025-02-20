import { storeContext } from "@/shared/constants/contexts";
import { observer } from "mobx-react-lite"; // Правильный импорт
import { FormEvent, useContext, useState } from "react";
import { Navigate } from "react-router";
import { Loader } from "@/shared/ui/loader";
import s from "./Login.module.css";
import { Button } from "@/shared/ui/button";
import { FetchStatus } from "@/shared/constants/api";
import { Form } from "@/shared/ui/form/Form";

const LoginComponent = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { authStore } = useContext(storeContext);

  if (authStore.isAuth) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className={s.page}>
      {authStore.isAuthChecking ? (
        <Loader />
      ) : (
        <Form
          name="login"
          onSubmit={(e: FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
            authStore.login(email, password);
          }}
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

          {authStore.status === FetchStatus.Error && (
            <p className={s.statusError}>{authStore.message}</p>
          )}
        </Form>
      )}
    </div>
  );
};

export const Login = observer(LoginComponent);
