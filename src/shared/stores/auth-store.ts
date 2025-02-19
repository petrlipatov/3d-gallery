import { makeAutoObservable } from "mobx";
import { AuthService } from "../services/AuthService";
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { BASE_API_URL } from "../constants";
import { AuthStatus } from "../constants/auth-store";
import { IUser } from "../models/IUser";

class Store {
  user: IUser | null = null;
  isAuth = false;
  status: AuthStatus = AuthStatus.Idle;
  isAuthChecking: boolean = true;
  message: string | null = null;
  private errorTimeout: NodeJS.Timeout | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setStatus(status: AuthStatus) {
    this.status = status;
  }

  setUser(user) {
    this.user = user;
  }

  setMessage(message: string, autoClear: boolean = true) {
    this.message = message;
    if (!autoClear) return;
    clearTimeout(this.errorTimeout);
    this.errorTimeout = setTimeout(() => {
      this.clearError();
    }, 3000);
  }

  clearError() {
    if (this.errorTimeout) clearTimeout(this.errorTimeout);
    this.message = null;
    this.status = AuthStatus.Idle;
    this.errorTimeout = null;
  }

  setIsAuthChecking(status: boolean) {
    this.isAuthChecking = status;
  }

  async login(email, password) {
    try {
      this.setStatus(AuthStatus.Loading);
      const res = await AuthService.login(email, password);
      localStorage.setItem("token", res.data.accessToken);
      this.setAuth(true);
      this.setUser(res.data.user);
      this.setStatus(AuthStatus.Ok);
    } catch (err) {
      this.setStatus(AuthStatus.Error);
      if (axios.isAxiosError(err)) {
        if (err.response.status === 400) {
          this.setMessage("Incorrect login or password.");
        }
      } else {
        this.setMessage("Unexpected error: Reload the page and try again.");
      }
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      this.setAuth(false);
      this.setUser({});
    } catch (err) {
      this.setStatus(AuthStatus.Error);
      this.setMessage(err);
    }
  }

  async checkAuth() {
    try {
      this.setStatus(AuthStatus.Loading);
      const res = await axios.get<AuthResponse>(`${BASE_API_URL}/refresh`, {
        withCredentials: true,
      });
      localStorage.setItem("token", res.data.accessToken);
      this.setAuth(true);
      this.setUser(res.data.user);
      this.setStatus(AuthStatus.Ok);
    } catch (err) {
      console.log(err);
    }
  }
}

export const authStore = new Store();
