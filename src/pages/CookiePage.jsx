import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
// .env로 부터 백엔드 URL 받아오기
const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

function CookiePage() {
  const navigate = useNavigate();
  const { contextLogin, contextLogout } = useUser();
  // 페이지 접근시 (백엔드에서 리디렉션으로 여기로 보내면, 실행)
  useEffect(() => {
    const cookieToBody = async () => {
      // 요청
      try {
        const res = await fetch(`${BACKEND_API_BASE_URL}/jwt/exchange`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) throw new Error("인증 실패");

        const data = await res.json();
        contextLogin(
          {
            id: data.userId,
            username: data.username,
            name: data.name,
            role: data.role,
          },
          data.accessToken
        );
        navigate("/");
      } catch (err) {
        alert("소셜 로그인 실패");
        contextLogout();
        navigate("/login");
      }
    };

    cookieToBody();
  }, []);

  return <p>로그인 처리 중입니다...</p>;
}

export default CookiePage;
