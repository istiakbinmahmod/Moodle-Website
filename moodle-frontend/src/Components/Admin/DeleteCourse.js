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
import useStyles from "../Dashboard/StudentDashboard/StudentDashboardStyle";
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
  const [courseId, setCourseId] = useState();
  const getToken = localStorage.getItem("token");

  const session_months = ["Jan", "Jun"];
  const years_list = ["2021", "2022", "2023"];

  let url = "http://localhost:5000/api/courses/";
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
    console.log(data);
    if (!data.courseID) {
      alert("Invalid credentials");
    } else {
      axios({
        method: "POST",
        url: "http://localhost:5000/api/admin/delete-course/" + courseId,
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Bearer " + getToken,
        },
        data: data,
      })
        .then((res) => {
          alert("Course deleted successfully");
          if (res.data.success) {
            alert("Course deleted successfully");
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
                width: "150%",
                maxWidth: "150%",
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
                Delete-Course Panel
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
          <Grid item sm={4} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography color="primary" variant="h4">
              Course Information
            </Typography>
            <br />
            <Grid item>
              {!isLoading && loadedCoursesList && (
                <Grid item>
                  <Autocomplete
                    style={{ width: "100%", height: "78px" }}
                    helperText={errors.courseID?.message}
                    id="place-select"
                    name="courseID"
                    sx={{ width: 300 }}
                    // value={sessionId}
                    onChange={(event, newValue) => {
                      console.log(newValue.id);
                      setCourseId(newValue.id);
                    }}
                    options={coursesList}
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
                        {...register("courseID", {
                          required: " courseID is required",
                        })}
                        label="Choose a Course"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                </Grid>
              )}
            </Grid>
            <Grid item container>
              <Grid item sm={4} />
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "20px", marginBottom: "20px" }}
                  onClick={handleSubmit(onSubmit)}
                >
                  Delete Course
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
