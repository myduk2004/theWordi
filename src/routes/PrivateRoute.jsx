import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const PrivateRoute = ({requireRole}) => {
  const { user, loading } = useUser();

  if (loading) {
    return null;
  }

  if (!user.isLogin) {
    return <Navigate to="/login" replace />;
  }
 

  if (user.role !== requireRole)
  {
    return <Navigate to="/Unauthorized" replace />;
  } 

  return <Outlet />;
};

export default PrivateRoute;
