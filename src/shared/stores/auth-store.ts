import { makeAutoObservable } from "mobx";
import { AuthService } from "../services/AuthService";
import axios from "axios";
import { AuthResponse, User } from "../models";
import { BASE_API_URL } from "../constants";
import { FetchStatus } from "../constants/api";
import { RootStore } from "./root-store";

export class AuthStore {
  rootStore: RootStore;
  user: User | null = null;
  isAuth = false;
  status: FetchStatus = FetchStatus.Idle;
  isAuthChecking: boolean = true;
  message: string | null = null;
  private errorTimeout: NodeJS.Timeout | null = null;

  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.initAuth();
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setStatus(status: FetchStatus) {
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
    this.status = FetchStatus.Idle;
    this.errorTimeout = null;
  }

  setIsAuthChecking(status: boolean) {
    this.isAuthChecking = status;
  }

  initAuth() {
    if (localStorage.getItem("token")) {
      this.checkAuth().finally(() => {
        this.setIsAuthChecking(false);
      });
    } else {
      this.setIsAuthChecking(false);
    }
  }

  async login(email, password) {
    try {
      this.setStatus(FetchStatus.Loading);
      const res = await AuthService.login(email, password);
      localStorage.setItem("token", res.data.accessToken);
      this.setAuth(true);
      this.setUser(res.data.user);
      this.setStatus(FetchStatus.Ok);
    } catch (err) {
      this.setStatus(FetchStatus.Error);
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
      this.setUser(null);
    } catch (err) {
      this.setStatus(FetchStatus.Error);
      this.setMessage(err);
    }
  }

  async checkAuth() {
    try {
      this.setStatus(FetchStatus.Loading);
      const res = await axios.get<AuthResponse>(`${BASE_API_URL}/refresh`, {
        withCredentials: true,
      });
      localStorage.setItem("token", res.data.accessToken);
      this.setAuth(true);
      this.setUser(res.data.user);
      this.setStatus(FetchStatus.Ok);
    } catch (err) {
      console.log(err);
    }
  }
}
