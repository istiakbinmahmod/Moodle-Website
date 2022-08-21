import {
  Card,
  Typography,
  TextField,
  Grid,
  Checkbox,
  Button,
} from "@mui/material";
import React, { useContext } from "react";
import useStyles from "./LoginStyle";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";

function Login() {
  const classes = useStyles();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (!data.moodleID || !data.password) {
      alert("Invalid credentials");
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
            auth.login(res.data.userId, res.data.userRole, res.data.token);
            navigate("/homepage");
          }
          setLoading(false);
        })
        .catch((err) => {
          if (!err.response.data.success) {
            alert(err.response.data.message);
          }
          setLoading(false);
        });
      setLoading(false);
    }
  };
  return <div>navigate("/");</div>;
}

export default Login;
