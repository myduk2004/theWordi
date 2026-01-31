import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
import "./Login.scss";
import api from "../api/api";
import { useUser } from "../contexts/UserContext";
const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

export default function Login() {
  const { contextLogin } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (username === "" || password === "") {
      setError("아이디와 비밀번호를 입력하세요.");
      return;
    }

    //로그인처리
    try {
      const res = await api.post("/login", {
        username,
        password,
      });

      const data = await res.data;

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
      setError("아이디 혹은 비밀번호가 틀렸습니다.");
      return;
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${BACKEND_API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card shadow-sm p-4"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h3 className="text-center mb-4 text-primary fw-bold">
          theWord.I 로그인
        </h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              아이디
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              비밀번호
            </label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

          {error && <p>{error}</p>}

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              로그인
            </button>
          </div>
        </form>

        <div className="social-login text-center mt-4">
          <button
            className="btn btn-google btn-sm mx-1"
            onClick={() => handleSocialLogin("google")}
          >
            <FaGoogle size={14} />
          </button>
          <button
            className="btn btn-naver btn-sm mx-1"
            onClick={() => handleSocialLogin("naver")}
          >
            <SiNaver size={14} />
          </button>
          <button className="btn btn-kakao btn-sm mx-1">
            <RiKakaoTalkFill size={14} />
          </button>
        </div>
        <hr />

        <div className="text-center">
          <a href="/register" className="text-decoration-none">
            회원가입
          </a>{" "}
          |{" "}
          <a href="/find-password" className="text-decoration-none">
            비밀번호 찾기
          </a>
        </div>
      </div>
    </div>
  );
}
