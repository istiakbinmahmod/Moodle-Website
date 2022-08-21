import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "../../Context/AuthContext";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  // useEffect(() => {
  //   if (Cookies.get("auth-token")) {
  //     navigate("/");
  //   }
  // }, []);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    moodleID: "",
    password: "",
  });

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const onSubmit = () => {
    if (!data.moodleID || !data.password) {
      toast.error("Invalid credentials");
    } else {
      setLoading(true);
      axios({
        method: "POST",
        url: "http://localhost:5000/api/users/login",
        headers: {
          "Content-Type": "Application/json",
        },
        data: data,
      })
        .then((res) => {
          if (res.data.success) {
            Cookies.set("auth-token", res.data.token);
            console.log("user role hocche ", res.data.userRole);
            auth.login(res.data.userId, res.data.userRole, res.data.token);
            navigate("/homepage");
          }
          setLoading(false);
        })
        .catch((err) => {
          if (!err.response.data.success) {
            alert(err.response.data.message);
            // toast.error(err.response.data.message);
          }
          setLoading(false);
        });
      setLoading(false);
    }
  };

  return (
    <div className="singin">
      <div className="form__box">
        <h5>Sign In</h5>

        <div className="form-group">
          <FaEnvelope className="icons" />
          <input
            value={data.moodleID}
            onChange={handleInput}
            name="moodleID"
            type="input"
            placeholder="Moodle ID"
          />
        </div>

        <div className="form-group last-child">
          <FaLock className="icons" />
          <input
            value={data.password}
            onChange={handleInput}
            name="password"
            type="password"
            placeholder="Password"
          />
        </div>

        <p className="forgot__password">Forgot password?</p>
        <button onClick={onSubmit} disabled={loading} className="form-btn">
          {!loading ? "Login" : "Loading..."}
        </button>
        {/* <p className="bottom-text">
          Don't have an account?{" "}
          <NavLink to="/register">
            <span>Create here</span>
          </NavLink>
        </p> */}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
