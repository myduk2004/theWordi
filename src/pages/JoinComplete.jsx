 
import { useNavigate, useLocation } from "react-router-dom";  
const JoinComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {username, name, email} = location.state || {};

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-5 text-center" style={{ width: "100%", maxWidth: "420px" }}>

        {/* 체크 아이콘 */}
        <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-4"
          style={{ width: 80, height: 80 }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
            stroke="#198754" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="7,18 15,26 29,11" />
          </svg>
        </div>

        <h4 className="fw-bold mb-2">회원가입이 완료됐어요</h4>
        <p className="text-muted mb-4" style={{ fontSize: 14 }}>
          환영합니다! 지금 바로 서비스를 이용해보세요.
        </p>

        {/* 가입 정보 */}
        <div className="bg-light rounded p-3 mb-4 text-start">
          {[
            { label: "아이디", value: username },
            { label: "이름",   value: name },
            { label: "이메일", value: email },
          ].map(({ label, value }) => (
            <div key={label} className="d-flex justify-content-between py-1 border-bottom last-border-0">
              <span className="text-muted small">{label}</span>
              <span className="fw-medium small">{value}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-primary btn-lg w-100 mb-2"
          onClick={() => navigate("/login")}>
          로그인하러 가기
        </button>
        <button className="btn btn-outline-primary btn-lg w-100"
          onClick={() => navigate("/")}>
          홈으로
        </button>
      </div>
    </div>
  );
};

export default JoinComplete;