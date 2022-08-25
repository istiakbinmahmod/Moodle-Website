import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const [userName, setUserName] = useState(false);

  const login = useCallback((uid, username, urole, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    setUserRole(urole);
    setUserName(username);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        userRole: urole,
        token: token,
        userName: username,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
    localStorage.setItem("userName", username);
    localStorage.setItem("userId", uid);
    localStorage.setItem("userRole", urole);
    localStorage.setItem("token", token);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setUserName(null);
    setUserRole(null);
    localStorage.removeItem("userData");
    localStorage.clear();
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.userName,
        storedData.userRole,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userId, userName, userRole };
};
