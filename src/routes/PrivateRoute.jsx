import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const PrivateRoute = ({ requireRole = []}) => {
  const { user, loading } = useUser();

  if (loading) {
    return null;
  }

  if (!user.isLogin) {
    return <Navigate to="/login" replace />;
  } 

  const hasPermission = requireRole.length === 0 
  ||  requireRole.includes(user.role) 
  || user.role.toLowerCase() === "admin"; 

  if (!hasPermission)
  {
    return <Navigate to="/Unauthorized" replace />;
  } 

  return <Outlet />;
};

export default PrivateRoute;
