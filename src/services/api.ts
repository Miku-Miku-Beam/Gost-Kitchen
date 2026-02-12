import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export interface loginData {
  email: string;
  password: string;
}

export interface RegisterData {
  restaurantName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: { id: string; restaurantName: string; email: string };
}

export const authAPI = {
  login: async (data: loginData): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  verity: async () => {
    const response = await api.get("/auth/verify");
    return response.data;
  },
};

export default authAPI;
