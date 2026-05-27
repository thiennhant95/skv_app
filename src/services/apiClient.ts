import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://protandimnrf2.vn/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("skv_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && data.status === 0) {
      const error = new Error(data.message || "Request failed");
      (error as any).responseData = data;
      if (data.message?.toLowerCase().includes("token") || data.message?.toLowerCase().includes("unauthorized")) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("skv_token");
          localStorage.removeItem("skv_user");
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("skv_token");
      localStorage.removeItem("skv_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
