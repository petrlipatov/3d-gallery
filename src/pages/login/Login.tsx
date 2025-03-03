import { observer } from "mobx-react-lite"; // Правильный импорт
import { FormEvent, useContext, useState } from "react";
import { Navigate } from "react-router";
import { Form } from "@/ui/form/Form";
import { Loader } from "@/ui/loader";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { storeContext } from "@/shared/constants/contexts";
import { FetchStatus } from "@/shared/constants/api";
import s from "./Login.module.css";

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
          <Input
            type="email"
            id="email"
            label="Email:"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <Input
            type="password"
            id="password"
            label="Password:"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="on"
            required
          />

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
