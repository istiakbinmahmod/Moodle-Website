import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  userName: null,
  userRole: null,
  token: null,
  login: () => {},
  logout: () => {},
});
