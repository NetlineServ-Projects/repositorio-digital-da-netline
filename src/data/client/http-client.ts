import axios, { type AxiosInstance } from "axios";
import { getAuthToken } from "./token.utils";
import { ConfigValue } from "../../config";


const Axios: AxiosInstance = axios.create({
  baseURL: ConfigValue.API_BASE_URL,
  timeout: 150000000,
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      //@ts-ignore
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    //@ts-ignore
    config.headers = {
      ...config.headers,
      "Accept-Language": localStorage.getItem("idioma") || "pt",
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export class HttpClient {
  static async get<T>(url: string, params?: unknown) {
    const response = await Axios.get<T>(url, { params });
    return response.data;
  }

  static async post<T>(url: string, data: unknown, options?: any) {
    const response = await Axios.post<T>(url, data, options);
    return response.data;
  }

  static async put<T>(url: string, data: unknown) {
    const response = await Axios.put<T>(url, data);
    return response.data;
  }

  static async delete<T>(url: string) {
    const response = await Axios.delete<T>(url);
    return response.data;
  }

  static async patch<T>(url: string, data: unknown) {
    const response = await Axios.patch<T>(url, data);
    return response.data;
  }
}