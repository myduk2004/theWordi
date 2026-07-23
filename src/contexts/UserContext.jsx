import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react";
import api from "../api/api";
const UserContext = createContext(null);

const initialUserState = {
  id: null,
  username: "Guest",
  name: "Guest",
  role: "Guest",
  isLogin: false,
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialUserState);
  const [loading, setLoading] = useState(true);

  const contextLogin = (userData, token) => {
    setUser({
      ...userData,
      isLogin: true,
    });

    localStorage.setItem("accessToken", token);
  };

  const contextLogout = () => {
    setUser(initialUserState);
    localStorage.removeItem("accessToken");
  };

  const contextValue = {
    user,
    contextLogin,
    contextLogout,
    loading,
  };

  useEffect(() => {
    const handleForceLogout = () => contextLogout();

    window.addEventListener("force-logout", handleForceLogout);

    //cleanup 함수 : 컴포넌트가 사라질떄 실행할 함수
    return () => window.removeEventListener("force-logout", handleForceLogout);
  }, []);

  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/user");
        setUser({
          id: res.data.userid,
          username: res.data.username,
          name: res.data.name,
          role: res.data.role,
          isLogin: true,
        });
      } catch {
        contextLogout();
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("UserProvider Error");
  }
  return context;
};

//export default UserContext;
