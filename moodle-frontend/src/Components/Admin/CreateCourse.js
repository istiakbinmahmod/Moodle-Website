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

let sessionsList = [];

function CreateCourse() {
  const classes = useStyles();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedSessionsList, setLoadedSessionsList] = useState();
  const [sessionId, setSessionId] = useState();
  const getToken = localStorage.getItem("token");

  const session_months = ["Jan", "Jun"];
  const years_list = ["2021", "2022", "2023"];

  let url = "http://localhost:5000/api/admin/get/sessions";
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });

        // setCourseList(responseData.courses);
        if (sessionsList.length === 0) {
          responseData.sessions.map((x) =>
            sessionsList.push({
              id: x._id,
              name: x.sessionID,
            })
          );
        }
        setLoadedSessionsList(responseData.sessions);
      } catch (err) {}
    };
    fetchSessions();
  }, [sendRequest, url, getToken]);

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
              Course Information
            </Typography>
            <br />
            <Grid item>
              {!isLoading && loadedSessionsList && (
                <Grid item>
                  <Autocomplete
                    style={{ width: "100%", height: "78px" }}
                    helperText={errors.courseID?.message}
                    id="place-select"
                    name="sessionID"
                    sx={{ width: 300 }}
                    // value={sessionId}
                    onChange={(event, newValue) => {
                      console.log(newValue.id);
                      setSessionId(newValue.id);
                    }}
                    options={sessionsList}
                    autoHighlight
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...register("sessionID", {
                          required: " sessionID is required",
                        })}
                        label="Choose a Session"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                </Grid>
              )}

              {/* <Grid item sm={3} /> */}

              <Grid item>
                <TextField
                  style={{ width: "100%", height: "78px" }}
                  helperText={errors.courseID?.message}
                  {...register("courseID", {
                    required: " courseID is required",
                  })}
                  error={Boolean(errors.courseID)}
                  className={classes.textField}
                  id="outlined-basic"
                  name="courseID"
                  label="courseID*"
                  variant="outlined"
                />
                <TextField
                  style={{ width: "100%", height: "78px" }}
                  {...register("courseTitle", {
                    required: " courseTitle is required",
                  })}
                  // type="password"
                  error={Boolean(errors.courseTitle)}
                  helperText={errors.courseTitle?.message}
                  className={classes.textField}
                  id="outlined-basic"
                  name="courseTitle"
                  label="courseTitle*"
                  variant="outlined"
                />
                <TextField
                  style={{ width: "100%", height: "78px" }}
                  {...register("courseDescription", {
                    required: " courseDescription is required",
                  })}
                  // type="password"
                  error={Boolean(errors.courseDescription)}
                  helperText={errors.courseDescription?.message}
                  className={classes.textField}
                  id="outlined-basic"
                  name="courseDescription"
                  label="courseDescription*"
                  variant="outlined"
                />
                <TextField
                  style={{ width: "100%", height: "78px" }}
                  {...register("courseCreditHour", {
                    required: " courseCreditHour is required",
                  })}
                  // type="number"
                  error={Boolean(errors.courseCreditHour)}
                  helperText={errors.courseCreditHour?.message}
                  className={classes.textField}
                  id="outlined-basic"
                  name="courseCreditHour"
                  label="courseCreditHour*"
                  variant="outlined"
                />

                {/* <div>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "20px", marginBottom: "20px" }}
                  >
                    Login
                  </Button>
                </div> */}
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
                  Create A Course
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

export default CreateCourse;
