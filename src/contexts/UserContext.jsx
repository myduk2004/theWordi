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
    return <div>로딩중 ...</div>;
  }

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("UserProvider Error");
  }
  return context;
};

//export default UserContext;
