import { Grid, Typography, Card, CardContent, Paper } from "@mui/material";
import { AuthContext } from "../Context/AuthContext";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../Context/http-hook";

import useStyles from "../Dashboard/Teams/TeamsStyle";
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
let teachersList = [];

const Assign = () => {
  const auth = useContext(AuthContext);
  const [courseId, setCourseId] = useState();
  //   const [grade, setGrade] = useState();
  const [teacherId, setTeacherId] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourseList, setLoadedCourseList] = useState();
  //course._id, courseID, sessionName
  const [loadedTeacherList, setLoadedTeacherList] = useState();
  //_id, moodleID, name

  const navigate = useNavigate();
  const getToken = localStorage.getItem("token");

  let url = "http://localhost:5000/api/courses/";

  let url2 = "http://localhost:5000/api/admin/get-teacher-list/";

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });

        // setCourseList(responseData.courses);
        responseData.courses.map((x) =>
          coursesList.push({
            id: x._id,
            courseID: x.courseID,
            sessionName: x.sessionName,
          })
        );
        setLoadedCourseList(responseData.courses);
        console.log(coursesList);
      } catch (err) {}
    };
    fetchCourse();
  }, [sendRequest, url, getToken]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const responseData = await sendRequest(url2, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        // setInstructorList(responseData.users);
        responseData.teachers.map((user) =>
          teachersList.push({
            id: user._id,
            moodleID: user.moodleID,
            name: user.name,
          })
        );
        setLoadedTeacherList(responseData.teachers);
        console.log(responseData);
        console.log(teachersList);
      } catch (err) {}
    };
    fetchTeachers();
  }, [sendRequest, url2, getToken]);

  return (
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
              Teacher-Course Assignment Panel
            </Typography>
          </Paper>
        </Grid>

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

          {!isLoading && loadedTeacherList && (
            // instructors.length !== 0 && (
            // !isLoading && instructorList &&
            <Grid item>
              <Autocomplete
                id="place-select"
                sx={{ width: 300 }}
                value={teacherId}
                onChange={(event, newValue) => {
                  console.log("ass: ", newValue.id);
                  setTeacherId(newValue.id);
                }}
                options={teachersList}
                autoHighlight
                getOptionLabel={(option) =>
                  option.moodleID + " , " + option.name
                }
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option.moodleID}, {option.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose an Instructor"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Grid>
          )}

          <Grid item sm={2} />
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
        <Grid item container>
          <Grid item sm={5} />
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "20px", marginBottom: "20px" }}
            >
              Assign Teacher
            </Button>
          </Grid>
          <Grid item sm={5} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Assign;
