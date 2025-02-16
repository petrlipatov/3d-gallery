import { makeAutoObservable } from "mobx";
import { AuthService } from "../services/AuthService";
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { BASE_API_URL } from "../constants";

class Store {
  user = {};
  isAuth = false;
  status: "idle" | "loading" | "ok" | "error" = "idle";
  isAuthChecking: boolean = true;
  message: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setStatus(status: "ok" | "idle" | "error" | "loading") {
    this.status = status;
  }

  setUser(user) {
    this.user = user;
  }

  setMessage(message: string | null) {
    this.message = message;
  }

  setIsAuthChecking(status: boolean) {
    this.isAuthChecking = status;
  }

  async login(email, password) {
    try {
      this.setStatus("loading");
      const res = await AuthService.login(email, password);
      localStorage.setItem("token", res.data.accessToken);
      this.setAuth(true);
      this.setUser(res.data.user);
      this.setStatus("ok");
    } catch (err) {
      this.setStatus("error");
      this.setMessage(err);
      console.log("err", err);
      // this.setError(err);
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      this.setAuth(false);
      this.setUser({});
    } catch (err) {
      this.setStatus("error");
      this.setMessage(err);
    }
  }

  async checkAuth() {
    try {
      this.setStatus("loading");
      const res = await axios.get<AuthResponse>(`${BASE_API_URL}/refresh`, {
        withCredentials: true,
      });
      localStorage.setItem("token", res.data.accessToken);
      this.setAuth(true);
      this.setUser(res.data.user);
      this.setStatus("ok");
    } catch (err) {
      console.log(err);
    }
  }
}

export const store = new Store();
