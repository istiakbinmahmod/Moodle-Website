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
import useStyles from "../Dashboard/Teams/TeamsStyle";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { useHttpClient } from "../Context/http-hook";

let coursesList = [];

function DeleteCourse() {
  const classes = useStyles();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCoursesList, setLoadedCoursesList] = useState();
  const getToken = localStorage.getItem("token");

  const session_months = ["Jan", "Jun"];
  const years_list = ["2021", "2022", "2023"];

  let url = "http://localhost:5000/api/admin/get/sessions";
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });

        // setCourseList(responseData.courses);
        if (coursesList.length === 0) {
          responseData.courses.map((x) =>
            coursesList.push({
              id: x._id,
              name: x.courseID,
            })
          );
        }
        setLoadedCoursesList(responseData.courses);
      } catch (err) {}
    };
    fetchCourses();
  }, [sendRequest, url, getToken]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (!data.courseID) {
      alert("Invalid credentials");
    } else {
      axios({
        method: "POST",
        url: "http://localhost:5000/api/courses",
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Bearer " + getToken,
        },
        data: data,
      })
        .then((res) => {
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
            <Grid item>
              {/* <TextField
                              id="outlined-basic"
                              label="Description"
                              variant="outlined"
                              multiline
                              maxRows={10}
                              sx={{minWidth: 600, bgcolor:'#f5f5f5'}}                                                                              
                              // value={desc}
                              onChange={(e) => setDesc(e.target.value)}
                          /> */}
            </Grid>
            <Grid item sm={3} />
          </Grid>
        </Grid>
        {/* </div> */}
        {/* <div> */}
        {/* <div
          style={{
            backgroundColor: "#f7f8fa",
            height: "100vh",
            justifyContent: "center",
          }}
        > */}
        {/* <div style={{ textAlign: "center" }}>
            <Typography className={classes.title} variant="h3">
              Create A Course
            </Typography>
          </div> */}
        <Grid item container spacing={2}>
          <Grid item sm={2.5} />
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <Card className={classes.card}> */}
            <Typography color="primary" variant="h4">
              Course Information
            </Typography>
            <br />
            <Grid item>
              {!isLoading && loadedSessionsList && (
                // courses.length !== 0 && (
                // !isLoading && courseList &&
                <Grid item>
                  <Autocomplete
                    style={{ width: "100%", height: "78px" }}
                    id="place-select"
                    sx={{ width: 300 }}
                    // value={sessionId}
                    onChange={(event, newValue) => {
                      // console.log(newValue.id);
                      // setSessionId(newValue.id);
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

export default DeleteCourse;
