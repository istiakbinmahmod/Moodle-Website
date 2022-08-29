import { Grid, Typography, Card, CardContent, Paper } from "@mui/material";
import { AuthContext } from "../Context/AuthContext";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../Context/http-hook";
import { useForm } from "react-hook-form";
import axios from "axios";
import useStyles from "../Dashboard/StudentDashboard/StudentDashboardStyle";
import { useEffect } from "react";
import {
  Button,
  Autocomplete,
  Box,
  TextField,
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
import LibraryAddTwoToneIcon from "@mui/icons-material/LibraryAddTwoTone";

let coursesList = [];
let studentsList = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

const Assign = () => {
  const auth = useContext(AuthContext);
  const [courseId, setCourseId] = useState();
  //   const [grade, setGrade] = useState();
  const [batchId, setBatchId] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourseList, setLoadedCourseList] = useState();
  //course._id, courseID, sessionName
  const [loadedStudentsList, setLoadedStudentsList] = useState();
  //_id, moodleID, name

  const navigate = useNavigate();
  const getToken = localStorage.getItem("token");

  let url = "http://localhost:5000/api/courses/";

  let url2 = "http://localhost:5000/api/admin/get-student-list/";

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!batchId || !courseId) {
      alert("Invalid credentials");
    } else {
      let url = "http://localhost:5000/api/admin/enrollStudents/" + courseId;
      try {
        await sendRequest(
          url,
          "POST",
          JSON.stringify({
            series: batchId,
          }),
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          }
        );
      } catch (error) {}
      alert("Student added to course");
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });

        if (coursesList.length === 0) {
          // setCourseList(responseData.courses);
          responseData.courses.map((x) =>
            coursesList.push({
              id: x._id,
              courseID: x.courseID,
              sessionName: x.sessionName,
            })
          );
        }
        setLoadedCourseList(responseData.courses);
      } catch (err) {}
    };
    fetchCourse();
  }, [sendRequest, url, getToken]);

  return (
    <div>
      <Grid container direction="column" spacing={3}>
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
              Individual Student-Course Assignment Panel
            </Typography>
          </Paper>
        </Grid>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid item container spacing={2}>
            <Grid item sm={3.5} />

            {!isLoading && loadedCourseList && (
              // courses.length !== 0 && (
              // !isLoading && courseList &&
              <Grid item>
                <Autocomplete
                  id="place-select"
                  sx={{ width: 300 }}
                  value={courseId}
                  onChange={(event, newValue) => {
                    // console.log(newValue.id);
                    setCourseId(newValue.id);
                  }}
                  options={coursesList}
                  autoHighlight
                  getOptionLabel={(option) =>
                    option.sessionName + " , " + option.courseID
                  }
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      {option.sessionName} , {option.courseID}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
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

            {/* {!isLoading && loadedStudentsList && ( */}
            <Grid item>
              <Autocomplete
                id="place-select"
                sx={{ width: 300 }}
                value={batchId}
                onChange={(event, newValue) => {
                  console.log("ass: ", newValue.id);
                  setBatchId(newValue);
                }}
                options={studentsList}
                autoHighlight
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a Batch"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Grid>
            {/* )} */}

            <Grid item sm={2} />
          </Grid>
          <Grid item container>
            <Grid item sm={3} />
            <Grid item></Grid>
            <Grid item sm={3} />
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
                Assign Batch to Course
              </Button>
            </Grid>
            <Grid item sm={5} />
          </Grid>
        </form>
      </Grid>
    </div>
  );
};

export default Assign;
