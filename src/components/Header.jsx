const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;
import { useEffect, useState, UseState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "./Header.css";
import { useUser } from "../contexts/UserContext";

const Header = ({ header }) => {
  const { bgCss, title, subTitle } = header;
  const [err, setErr] = useState("");
  const { user, contextLogout } = useUser();

  const handleLogout = async () => {
    try {
      const res = await api.post("/logout");
    } catch (err) {
      console.error("로그아웃 실패");
    } finally {
      contextLogout();
    }
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top"
        id="mainNav"
      >
        <div className="container px-4">
          <Link className="navbar-brand" to="/">
            TheWord.I
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/bible/create">
                  성경쓰기
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/bible/search">
                  성경검색
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/meditation">
                  말씀의 묵상
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/">
                  기도
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  {user.isLogin ? `${user.name}님 환영합니다.` : ""}
                </Link>
              </li>

              <li className="nav-item">
                {user.isLogin ? (
                  <Link className="nav-link" to="/">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-danger ms-2 btn-sm"
                    >
                      로그아웃{" "}
                    </button>
                  </Link>
                ) : (
                  <Link className="nav-link" to="/login">
                    <button className="btn btn-primary ms-2 btn-sm">
                      로그인
                    </button>
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* <!-- Header--> */}
      <header className={`${bgCss} bg-gradient`}>
        <div className="container px-4 text-center">
          <h1 className="fw-bolder">{title}</h1>
          <p className="lead">{subTitle}</p>
          <a className="btn btn-lg btn-light" href="/bible/create">
            Start Search!
          </a>
        </div>
      </header>
    </>
  );
};

export default Header;
