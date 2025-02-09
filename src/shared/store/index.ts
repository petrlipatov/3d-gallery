import { makeAutoObservable } from "mobx";
import { AuthService } from "../services/AuthService";
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { BASE_API_URL } from "../constants";

class Store {
  user = {};
  isAuth = false;
  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUser(user) {
    this.user = user;
  }

  async login(email, password) {
    try {
      const res = await AuthService.login(email, password);
      localStorage.setItem("token", res.data.accessToken);
      this.setAuth(true);
      this.setUser(res.data.user);
    } catch (err) {
      console.log(err);
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItemItem("token");
      this.setAuth(false);
      this.setUser({});
    } catch (err) {
      console.log(err);
    }
  }

  async checkAuth() {
    try {
      const res = await axios.get<AuthResponse>(`${BASE_API_URL}/refresh`, {
        withCredentials: true,
      });
      localStorage.setItem("token", res.data.accessToken);
      this.setAuth(true);
      this.setUser(res.data.user);
    } catch (err) {
      console.log(err);
    }
  }
}

export const store = new Store();
