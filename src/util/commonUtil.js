import api from "../api/api";

export async function login(username, password) {
  try {
    const res = await api.post("/login", {
      username,
      password,
    });

    const data = await res.data;
    localStorage.setItem("accessToken", data.accessToken);

    //백엔드에서 받은 사용자 정보와 토큰을 Context에 전달
    return true;
  } catch (err) {
    return false;
  }
}
