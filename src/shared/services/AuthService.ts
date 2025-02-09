import { api } from "@/shared/http";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";

export class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>("/login", { email, password });
  }

  static async register(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>("/register", { email, password });
  }

  static async logout(): Promise<void> {
    return api.post("/logout");
  }
}
