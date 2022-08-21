import MainRouter from "./Components/MainRouter";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme";
import { AuthContext } from "./Components/Context/AuthContext";
import { useAuth } from "./Components/Context/auth-hook";

function App() {
  const { token, login, logout, userId, userRole } = useAuth();
  return (
    <div>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider
          value={{
            isLoggedIn: !!token,
            token: token,
            userId: userId,
            userRole: userRole,
            login: login,
            logout: logout,
          }}
        >
          <MainRouter />
        </AuthContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
