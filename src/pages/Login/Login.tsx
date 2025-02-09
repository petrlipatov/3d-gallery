import { authContext } from "@/shared/constants/contexts";
import { observer } from "mobx-react-lite"; // Правильный импорт

import React, { useContext, useEffect, useState } from "react";

const LoginComponent = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const store = useContext(authContext);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, [store]);

  return (
    <div>
      <h1>{`${store.isAuth ? "авторизован" : "не авторизован"}`}</h1>
      <input
        placeholder="Email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={() => store.login(email, password)}>Login</button>
    </div>
  );
};

export const Login = observer(LoginComponent);
