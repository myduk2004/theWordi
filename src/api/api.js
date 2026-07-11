import axios from "axios";
import { refreshAccessToken } from "./auth";
import { CgBandAid } from "react-icons/cg";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_BASE_URL,
  withCredentials: true,
  headers: {},
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);
const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};


// 요청 인터셉터: AccessToken 자동 추가
// api.interceptors.reques.use : 두개의 콜백함수 인자
// 성공핸들러(요청이 서버에 가기직전 실행코드), 에러핸들러
api.interceptors.request.use((config) => { 
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
  return config;
});

// 응답 인터셉터: 401 발생 시 RefreshToken 재발급 후 재요청
// api.interceptors.response.use : 두개의 콜백함수 인자 
// http상태코드, error Handler

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // 이미 refresh 중이면 대기했다가 새 토큰으로 재요청
        // 실행 함수 자체를 저장
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {

        const newAccessToken = await refreshAccessToken();
        localStorage.setItem("accessToken", newAccessToken); 

        //accessToken 발급동안 누적된 요청 처리
        onRefreshed(newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) { 

        //localStorage.removeItem("accessToken");

        // 컴포넌트/모듈과 상관없이 전역적으로 신호를 보내고 받을 수 있는 기능 
        // window.dispatchEvent: 방송송출
        // window.addEventListener: 라디오를 켜서 방송을 든는것  
        window.dispatchEvent(new Event("force-logout"));

        return Promise.reject(refreshError.response ?? refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error.response ?? error);
  }
);

export default api;
