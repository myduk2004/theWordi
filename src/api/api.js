import axios from "axios";
import { refreshAccessToken } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_BASE_URL,
  withCredentials: true,
  headers: {},
});

// 요청 인터셉터: AccessToken 자동 추가
api.interceptors.request.use((config) => {
  // console.log("Request : ", config);
  // console.log("Method : ", config.method);
  // console.log("Headers : ", config.headers);
  // console.log("Data:", config.data);

  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
  return config;
});

// 응답 인터셉터: 401 발생 시 RefreshToken 재발급 후 재요청
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; 

    if (error.response?.status === 401 && !originalRequest._retry) {
      // 401 + 재시도 안 한 경우
      originalRequest._retry = true; // 무한 루프 방지
      
      try {
        const newAccessToken = await refreshAccessToken();
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest); // 원래 요청 재시도
      } catch (err) {
        localStorage.removeItem("accessToken");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
