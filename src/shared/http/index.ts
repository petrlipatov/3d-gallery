import axios from "axios";
import { BASE_API_URL } from "@/shared/constants";
import { AuthResponse } from "../models/response/AuthResponse";

export const api = axios.create({
  withCredentials: true,
  baseURL: BASE_API_URL,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (err) => {
    const originalRequest = err.config;
    if (err.response.status === 401) {
      try {
        const res = await axios.get<AuthResponse>(`${BASE_API_URL}/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem("token", res.data.accessToken);
        return api.request(originalRequest);
      } catch (e) {
        console.log(e);
      }
    }
  }
);
