import {
  Card,
  Typography,
  TextField,
  Grid,
  Checkbox,
  Paper,
  Button,
  Autocomplete,
  Box,
  InputLabel,
  Select,
  MenuItem,
  Input,
  InputAdornment,
  IconButton,
  FormHelperText,
  FormLabel,
  RadioGroup,
  Radio,
  FormGroup,
  FormControl,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
// import useStyles from "../Login/LoginStyle";
import useStyles from "../Dashboard/StudentDashboard/StudentDashboardStyle";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { useHttpClient } from "../Context/http-hook";

function CreateStudent() {
  const classes = useStyles();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [sessionId, setSessionId] = useState();
  const getToken = localStorage.getItem("token");

  const session_months = ["Jan", "Jun"];
  const years_list = ["2021", "2022", "2023"];

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    if (
      !data.sessionID ||
      !data.courseID ||
      !data.courseTitle ||
      !data.courseDescription ||
      !data.courseCreditHour
    ) {
      alert("Invalid credentials");
    } else {
      axios({
        method: "POST",
        url: "http://localhost:5000/api/admin/create-course/" + sessionId,
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Bearer " + getToken,
        },
        data: data,
      })
        .then((res) => {
          alert("Course created successfully");
          if (res.data.success) {
            alert("Course created successfully");
          }
        })
        .catch((err) => {
          if (!err.response.data.success) {
            alert(err.response.data.message);
          }
        });
    }
  };
  return (
    <>
      <div>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            {/* make it to center */}
            {/* assh color : #f5f5f5 */}
            <Paper
              className="paper"
              sx={{
                width: "100%",
                maxWidth: "100%",
                bgcolor: "#f5f5f5",
                alignContent: "center",
              }}
            >
              <Typography
                sx={{
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  color: "black",
                  font: "caption",
                }}
              >
                Create-Course Panel
              </Typography>
            </Paper>
          </Grid>

          <Grid item container>
            <Grid item sm={3} />
            <Grid item></Grid>
            <Grid item sm={3} />
          </Grid>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item sm={2.5} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography color="primary" variant="h4">
              Student Information
            </Typography>
            <br />
            <Grid item>
              {/* <Grid item sm={3} /> */}

              <Grid item>
                <TextField
                  style={{ width: "100%", height: "78px" }}
                  helperText={errors.moodleID?.message}
                  {...register("moodleID", {
                    required: " moodleID is required",
                  })}
                  error={Boolean(errors.moodleID)}
                  className={classes.textField}
                  id="outlined-basic"
                  name="moodleID"
                  label="moodleID*"
                  variant="outlined"
                />
                <TextField
                  style={{ width: "100%", height: "78px" }}
                  {...register("userName", {
                    required: " userName is required",
                  })}
                  error={Boolean(errors.userName)}
                  helperText={errors.userName?.message}
                  className={classes.textField}
                  id="outlined-basic"
                  name="userName"
                  label="userName*"
                  variant="outlined"
                  // InputLabelProps={{ shrink: true }}
                />
                <TextField
                  style={{ width: "100%", height: "78px" }}
                  {...register("emailID", {
                    required: " emailID is required",
                  })}
                  type="email"
                  error={Boolean(errors.emailID)}
                  helperText={errors.emailID?.message}
                  className={classes.textField}
                  id="outlined-basic"
                  name="emailID"
                  label="emailID*"
                  variant="outlined"
                  // InputLabelProps={{ shrink: true }}
                />
                <TextField
                  style={{ width: "100%", height: "78px" }}
                  {...register("password", {
                    required: " password is required",
                  })}
                  // type="password"
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  className={classes.textField}
                  id="outlined-basic"
                  name="password"
                  label="password*"
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid item container>
              <Grid item sm={5} />
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "20px", marginBottom: "20px" }}
                  onClick={handleSubmit(onSubmit)}
                >
                  Create Student
                </Button>
              </Grid>
              <Grid item sm={5} />
            </Grid>
            {/* </Card> */}
          </form>
        </Grid>
      </div>
    </>
  );
}

export default CreateStudent;
