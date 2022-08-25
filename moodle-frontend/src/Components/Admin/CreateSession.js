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

function CreateSession() {
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
    if (!data.sessionID || !data.startDate || !data.endDate) {
      alert("Invalid credentials");
    } else {
      axios({
        method: "POST",
        url: "http://localhost:5000/api/admin/create-session/",
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Bearer " + getToken,
        },
        data: data,
      })
        .then((res) => {
          alert("Session created successfully");
          if (res.data.success) {
            alert("Session created successfully");
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
                Create-Session Panel
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
              Session Information
            </Typography>
            <br />
            <Grid item>
              {/* <Grid item sm={3} /> */}

              <Grid item>
                <TextField
                  style={{ width: "100%", height: "78px" }}
                  helperText={errors.sessionID?.message}
                  {...register("sessionID", {
                    required: " sessionID is required",
                  })}
                  error={Boolean(errors.sessionID)}
                  className={classes.textField}
                  id="outlined-basic"
                  name="sessionID"
                  label="sessionID*"
                  variant="outlined"
                />
                <TextField
                  style={{ width: "100%", height: "78px" }}
                  {...register("startDate", {
                    required: " startDate is required",
                  })}
                  type="date"
                  error={Boolean(errors.startDate)}
                  helperText={errors.startDate?.message}
                  className={classes.textField}
                  id="outlined-basic"
                  name="startDate"
                  label="startDate*"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  style={{ width: "100%", height: "78px" }}
                  {...register("endDate", {
                    required: " endDate is required",
                  })}
                  type="date"
                  error={Boolean(errors.endDate)}
                  helperText={errors.endDate?.message}
                  className={classes.textField}
                  id="outlined-basic"
                  name="endDate"
                  label="endDate*"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
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
                  Create A Session
                </Button>
              </Grid>
              <Grid item sm={5} />
            </Grid>
          </form>
        </Grid>
      </div>
    </>
  );
}

export default CreateSession;
