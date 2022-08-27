import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export const RequireAuth = ({ children }) => {
  function isLogin() {
    return localStorage.getItem("userId") !== null;
  }

  const location = useLocation();

  if (!isLogin()) {
    return <Navigate to="/" state={{ path: location.pathname }}></Navigate>;
  }

  return children;
};
