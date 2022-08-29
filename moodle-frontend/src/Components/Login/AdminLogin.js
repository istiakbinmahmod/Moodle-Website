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

function AdminLogin() {
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
    if (!data.email || !data.password) {
      alert("Invalid credentials");
    } else {
      setLoading(true);
      axios({
        method: "POST",
        url: "http://localhost:5000/api/admin/login",
        headers: {
          "Content-Type": "Application/json",
        },
        data: data,
      })
        .then((res) => {
          if (res.data.success) {
            console.log(res.data);
            // alert("Login Successful");
            navigate("/admin/homepage");
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
  return (
    <div
      style={{
        backgroundColor: "#f7f8fa",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Typography className={classes.title} variant="h3">
          Login to Moodle as Admin
        </Typography>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className={classes.card}>
          <Typography color="primary" variant="h4">
            Login
          </Typography>
          <br />
          <Grid>
            <Grid item>
              <TextField
                style={{ width: "70%", height: "78px" }}
                helperText={errors.email?.message}
                {...register("email", {
                  required: " Email is required",
                })}
                error={Boolean(errors.email)}
                className={classes.textField}
                id="outlined-basic"
                name="email"
                label="Email*"
                variant="outlined"
              />
              <TextField
                style={{ width: "70%", height: "78px" }}
                {...register("password", { required: " Password is required" })}
                type="password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                className={classes.textField}
                id="outlined-basic"
                name="password"
                label="Password*"
                variant="outlined"
              />

              <div>
                <Link to="/" style={{ textDecoration: "none" }}>
                  Login as Teacher/Student ?
                </Link>
              </div>
              <br />

              <div>
                <Button type="submit" variant="outlined">
                  Login
                </Button>
              </div>
            </Grid>
          </Grid>
        </Card>
      </form>
    </div>
  );
}

export default AdminLogin;
