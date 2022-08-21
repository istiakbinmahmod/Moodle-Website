import Cookies from "js-cookie";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import logo from "../../img/Moodle-Logo.wine.png";
import "./Navbar.css";
import { FaShoppingBag } from "react-icons/fa";

function Navbar({ isLoggedIn, userRole }) {
  const auth = useContext(AuthContext);
  // const { setIsLoggedIn } = useContext(AuthContext);
  // if (Cookies.get("auth-token")) {
  //   setIsLoggedIn(true);
  // }

  return (
    <header>
      <div className="logo">
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <img src={logo} alt="" />
        </NavLink>
      </div>

      <menu>
        <ul>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <li>Home</li>
          </NavLink>

          {!isLoggedIn || userRole == "admin" ? (
            <NavLink to="/courses" style={{ textDecoration: "none" }}>
              <li>All Courses</li>
            </NavLink>
          ) : (
            <NavLink to="/my-dashboard" style={{ textDecoration: "none" }}>
              <li>Dashboard</li>
            </NavLink>
          )}

          {!isLoggedIn || userRole == "admin" ? (
            <NavLink to="/sessions" style={{ textDecoration: "none" }}>
              <li>All Sessions</li>
            </NavLink>
          ) : (
            <NavLink to="/homepage" style={{ textDecoration: "none" }}>
              <li>My Courses</li>
            </NavLink>
          )}

          {isLoggedIn && userRole != "admin" && (
            <NavLink
              to={"/profile/" + auth.userId}
              style={{ textDecoration: "none" }}
            >
              <li>My Profile</li>
            </NavLink>
          )}

          {/* <li>
            Cart <FaShoppingBag />
          </li> */}
        </ul>
      </menu>

      <div className="button">
        {isLoggedIn ? (
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <button onClick={auth.logout}>Logout</button>
          </NavLink>
        ) : (
          <NavLink to="/login" style={{ textDecoration: "none" }}>
            <button>Login</button>
          </NavLink>
        )}
      </div>
    </header>
  );
}

export default Navbar;
