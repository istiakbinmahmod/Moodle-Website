import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL COURSES
        </NavLink>
      </li>
      <li>
        <NavLink to="/sessions" exact>
          ALL SESSIONS
        </NavLink>
      </li>
      {/* {auth.isLoggedIn && (
        <li>
          <NavLink to="/u1/places">CREATE USER</NavLink>
        </li>
      )} */}
      {/* {auth.isLoggedIn && (
        <li>
          <NavLink to="/u1/places">CREATE USER</NavLink>
        </li>
      )} */}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/api/admin/create/user">CREATE USER</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/api/admin/create-course">CREATE COURSE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/api/admin/create-session">CREATE SESSION</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/api/admin/delete-course">DELETE COURSE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/api/admin/edit-course">EDIT COURSE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">ADMIN LOGIN</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
