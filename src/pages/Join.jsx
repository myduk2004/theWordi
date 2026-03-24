import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { joinApi } from "../api/joinApi"; 

const validationRule = {
    username: {
        label: "아이디",
        rules: [
            { label: "5~20자", test: (v) => v.length >= 5 && v.length <= 20 },
            { label: "영문 포함", test: (v) => /[a-zA-Z]/.test(v) },
            { label: "특수문자 사용 불가", test: (v) => !/[^a-zA-Z0-9]/.test(v) },
        ]
    },
    password: {
        label: "비밀번호",
        rules: [
            { label: "8~16자", test: (v) => v.length >= 8 && v.length <= 16 },
            { label: "영문 대문자", test: (v) => /[A-Z]/.test(v) },
            { label: "영문 소문자", test: (v) => /[a-z]/.test(v) },
            { label: "숫자", test: (v) => /[0-9]/.test(v) },
            { label: "특수문자 (!@#$%^&*)", test: (v) => /[!@#$%^&*()_+\-={};':"\\|,.<>/?]/.test(v) },
        ]
    },
    name: {
        label: "이름",
        rules: [
            { label: "2자 이상", test: (v) => v.length >= 2 },
            { label: "한글 또는 영문", test: (v) => /^[가-힣a-zA-Z\s]+$/.test(v) },
        ]
    },
    email: {
        label: "이메일",
        rules: [
            { label: "이메일 형식을(를) 확인해주세요", test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
        ]
    }
}; 
const getResults = (key, value) =>
    validationRule[key].rules.map((r) => ({
        ...r, 
        passed : value? r.test(value): false,
    })); 
const isFieldValid = (key, value) => validationRule[key].rules.every((r) => value && r.test(value));  


const COLORS = {
    default: "#ced4da",
    valid:   "#198754",
    invalid: "#dc3545",
};

const getIconColor = (isTouched, isValid) => {
    if (!isTouched) return COLORS.default;
    return isValid ? COLORS.valid : COLORS.invalid;
};
  
const Join = () =>{

const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState(""); 
const [form, setForm] = useState({ username : "", password : "",  name : "", email : ""});
const [touched, setTouched] = useState({ username : false, password : false, name: false, email: false});  
const [show, setShow] = useState(false);
const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
const [isCheckingUserName, setIsCheckingUsername] = useState(false);
const allValid = Object.keys(validationRule).every((key) => isFieldValid(key, form[key]));
const navigate = useNavigate();
const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
};

const handleBlur = async (e) =>{
    const { name } = e.target; 
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === "username" && isFieldValid("username", form.username))
    {
        setIsCheckingUsername(true); 
        const userExists = await joinApi.isExistUser(form.username);
        setIsUsernameAvailable(!userExists);
        setIsCheckingUsername(false);
    } 
};

const handleSubmit = async (e) =>{
    e.preventDefault(); 

    try 
    {
        if (allValid && isUsernameAvailable && !isCheckingUserName)
        { 
            const data = await joinApi.create(form);  
            navigate("/join/complete", {
                state: {
                    username : form.username, 
                    email : form.email, 
                    name : form.name
                }
            });
        }
    }
    catch(err)
    { 
        console.log("err", err);
    }  
};


//username만 사용
const handleValidColor = (isTouched, isValid, bDirect) =>{

    if (bDirect)
    {
        //직접 컬러코드 지정
        if (!isTouched) return COLORS.default;
        return (isValid && isUsernameAvailable) ? COLORS.valid : COLORS.invalid;  
    }
    else 
    {
        //bootstrap 속성명 리턴
        if (!isTouched) return "";
        return (isValid && isUsernameAvailable) ? "is-valid" : "is-invalid";  
    }
}

return ( 
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow p-4" style={{ width: "100%", maxWidth: "500px" }}> 
            <h4 className="text-center mb-4 fw-bold">
            회원가입
            </h4>

            <form onSubmit={handleSubmit} noValidate>  
                <div className="mb-3">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"
                            style={{ borderColor: 
                                    ( handleValidColor(touched.username, isFieldValid("username", form.username), true))} 
                            }>                         
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                fill="none" viewBox="0 0 24 24"  
                                stroke={  
                                    handleValidColor(touched.username, isFieldValid("username", form.username), true)
                                } 
                                strokeWidth="1.8">
                                <circle cx="12" cy="8" r="4"/>
                                <path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                            </svg>
                        </span>
                        <input
                            type="text"
                            name="username"
                            className={`form-control form-control-lg border-start-0 ${
                                handleValidColor(touched.username, isFieldValid("username", form.username), false)
                            }`}
                            placeholder="아이디"
                            required
                            value={form.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                </div>
                {/* 규칙리스트 */} 
                {touched.username && isUsernameAvailable && (
                    <div className="row mt-1 mb-2 ps-1">
                        <div key="availableId" className="col-12 small text-success">
                        {"o"} 사용 가능한 아이디
                        </div> 
                    </div> 
                )}
                {touched.username && !isUsernameAvailable && (
                    <div className="row mt-1 mb-2 ps-1">
                        <div key="notAvailableId" className="col-12 small text-danger">
                        {"x"} 사용 불가능한 아이디
                        </div> 
                    </div> 
                )}  

                {touched.username && !isFieldValid("username", form.username) && (
                    <div className="row mt-1 mb-2 ps-1"> 
                        {getResults("username", form.username).map((r) => (
                            <div key={r.label} className={`col-6 small ${r.passed ? "text-success" : "text-danger"}`}>
                                {r.passed ? "o" : "x"} {r.label}
                            </div>
                        ))}
                    </div>
                )}

                <div className="mb-3">   
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"
                            style={{ borderColor: getIconColor(touched.password, isFieldValid("password", form.password))}}>  
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                fill="none" viewBox="0 0 24 24" strokeWidth="1.8"
                                stroke={ getIconColor(touched.password, isFieldValid("password", form.password))}>
                                <rect x="5" y="11" width="14" height="10" rx="2"/>
                                <path strokeLinecap="round" d="M8 11V7a4 4 0 018 0v4"/>
                            </svg> 
                        </span> 

                        <input
                        type={show?"text":"password"}
                        name="password" 
                        className={`form-control form-control-lg border-start-0 ${
                            touched.password
                                ? isFieldValid("password", form.password) ? "is-valid" : "is-invalid"
                                : ""
                        }`}
                        placeholder="비밀번호"
                        required
                        value={form.password} 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        />  

                        {/* 보기/숨기기 토글 */}
                        <span className="input-group-text bg-white border-start-0"
                            style={{
                                cursor: "pointer",
                                borderColor: getIconColor(touched.password, isFieldValid("password", form.password))
                            }}
                            onClick={() => setShow((prev) => !prev)}>
                            {show ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                    fill="none" viewBox="0 0 24 24" strokeWidth="1.8"
                                    stroke={getIconColor(touched.password, isFieldValid("password", form.password))}>
                                    <path strokeLinecap="round" d="M3 3l18 18M10.5 10.5A3 3 0 0013.5 13.5M6.5 6.5C4.6 8 3 10 3 12s4 7 9 7c1.5 0 3-.3 4.3-.8M9 5.1C9.6 5 10.3 5 11 5c5 0 8 4 9 7-.4 1.2-1 2.3-1.8 3.2"/>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                    fill="none" viewBox="0 0 24 24" strokeWidth="1.8"
                                    stroke={getIconColor(touched.password, isFieldValid("password", form.password))}>
                                    <path strokeLinecap="round" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            )}
                        </span>  
                    </div>
                </div>
                {/* 규칙리스트 */}
                {touched.password && !isFieldValid("password", form.password) && (
                    <div className="row mt-1 mb-2 ps-1"> 
                        {getResults("password", form.password).map((r) => (
                            <div key={r.label} className={`col-6 small ${r.passed ? "text-success" : "text-danger"}`}>
                                {r.passed ? "o" : "x"} {r.label}
                            </div>
                        ))}
                    </div>
                )}


                <div className="mb-3"> 
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"
                            style={{ borderColor: getIconColor(touched.name, isFieldValid("name", form.name))}}>  
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                fill="none" viewBox="0 0 24 24" strokeWidth="1.8"
                                stroke={getIconColor(touched.name, isFieldValid("name", form.name))}>
                                <path strokeLinecap="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"/>
                            </svg>
                        </span> 

                        <input
                        type="text"
                        name="name"
                        className={`form-control form-control-lg border-start-0 ${
                            touched.name
                                ? isFieldValid("name", form.name) ? "is-valid" : "is-invalid"
                                : ""
                        }`}
                        placeholder="이름"
                        required
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        />
                    </div>
                </div>
                {/* 규칙리스트 */}  
                {touched.name && !isFieldValid("name", form.name) && (
                    <div className="row mt-1 mb-2 ps-1">
                        {getResults("name", form.name).map((r) => (
                            <div key={r.label} className={`col-6 small ${r.passed ? "text-success" : "text-danger"}`}>
                                {r.passed ? "o" : "x"} {r.label}
                            </div>
                        ))}
                    </div>
                )}


                <div className="mb-3"> 
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"
                            style={{ borderColor: getIconColor(touched.email, isFieldValid("email", form.email)) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                fill="none" viewBox="0 0 24 24" strokeWidth="1.8"
                                stroke={getIconColor(touched.email, isFieldValid("email", form.email))}>
                                <path strokeLinecap="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                        </span>
                        
                        <input
                        type="text"
                        name="email"
                        className={`form-control form-control-lg border-start-0 ${
                            touched.email
                                ? isFieldValid("email", form.email) ? "is-valid" : "is-invalid"
                                : ""
                        }`}
                        placeholder="example@email.com"
                        required 
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        />
                    </div>
                </div>

                 {/* 규칙리스트 */}  
                {touched.email && !isFieldValid("email", form.email) && (
                    <div className="row mt-1 mb-2 ps-1">
                        {getResults("email", form.email).map((r) => (
                            <div key={r.label} className={`col-12 small ${r.passed ? "text-success" : "text-danger"}`}>
                                {r.passed ? "o" : "x"} {r.label}
                            </div>
                        ))}
                    </div>
                )}

                {error?.length > 0 && <div className="mb-3"> 
                    {error}
                {/* 5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다. */}
                </div>}

                <div className="d-grid">
                    <button type="button" 
                    className="btn btn-primary btn-lg" 
                    disabled={!allValid || !isUsernameAvailable || isCheckingUserName}
                    onClick={handleSubmit}>
                    {isCheckingUserName? "아이디 확인중..." : "가입하기"}
                    </button>
                </div>
            </form> 
            <hr /> 
        </div>
    </div>
)
}
 
export default Join;