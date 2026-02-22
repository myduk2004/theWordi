 import React, { useState } from 'react';
import { Link } from "react-router-dom";
const Unauthorized = () => {
  const [isHover, setIsHover] = useState(false);

  // 공통 스타일 객체들
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: "'Pretendard', sans-serif",
    color: '#333'
  };

  const errorCodeStyle = {
    fontSize: '120px',
    fontWeight: '900',
    margin: '0',
    color: '#E0E0E0', // 연한 회색으로 배경 느낌
    lineHeight: '1'
  };

  const messageStyle = {
    fontSize: '24px',
    fontWeight: '700',
    marginTop: '-20px', // 숫자와 가깝게 배치
    marginBottom: '10px'
  };

  const descriptionStyle = {
    fontSize: '16px',
    color: '#777',
    marginBottom: '40px',
    lineHeight: '1.6'
  };
 

  return (
    <div style={containerStyle}>
      {/* 큰 에러 코드 */}
      <h1 style={errorCodeStyle}>403</h1>
      
      {/* 메인 메시지 */}
      <h2 style={messageStyle}>접근 권한이 없습니다</h2>
      
      {/* 상세 설명 */}
      <p style={descriptionStyle}>
        죄송합니다. 요청하신 페이지를 볼 수 있는 권한이 없습니다.<br />
        로그인 상태를 확인하거나 관리자에게 문의해 주세요.
      </p>


      <Link className="btn btn-lg btn-primary" to="/">
       메인화면으로
      </Link>

      {/* 하단 장식 (선택 사항) */}
      <div style={{ marginTop: '60px', borderTop: '1px solid #eee', width: '100px' }}></div>
    </div>
  );
};

export default Unauthorized;

 
