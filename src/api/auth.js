import axios from "axios";

export async function refreshAccessToken() {
  const res = await axios.post("/jwt/refresh", {}, { withCredentials: true });

  if (!res.data?.accessToken) throw new Error("AccessToken 갱신 실패");

  return res.data.accessToken;
}
