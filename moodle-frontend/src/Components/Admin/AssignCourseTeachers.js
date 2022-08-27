import {
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
  Alert,
} from "@mui/material";
import { AuthContext } from "../Context/AuthContext";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../Context/http-hook";

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
import { useForm } from "react-hook-form";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { withAlert } from "react-alert";

let coursesList = [];
let teachersList = [];

const Assign = () => {
  const auth = useContext(AuthContext);
  const [courseId, setCourseId] = useState();
  const [teacherId, setTeacherId] = useState("");

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourseList, setLoadedCourseList] = useState();
  const [loadedTeachersList, setLoadedTeachersList] = useState();

  const [component, setComponent] = useState(<div></div>);
  const [component2, setComponent2] = useState(<div></div>);
  //_id, moodleID, name

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // alert(studentId);
    // alert(courseId);
    if (!teacherId || !courseId) {
      alert("Invalid credentials");
    } else {
      // teacherId = teacherId.join("");
      let url = "http://localhost:5000/api/admin/edit/" + courseId;
      try {
        await sendRequest(
          url,
          "PATCH",
          JSON.stringify({
            participants: teacherId,
          }),
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          }
        );
        alert("Teacher assigned successfully");
        window.location.reload();
      } catch (error) {}
      // alert("Teacher added to course");
    }
  };

  const navigate = useNavigate();
  const getToken = localStorage.getItem("token");

  let url = "http://localhost:5000/api/courses/";

  // let url2 = "http://localhost:5000/api/admin/get-student-list/";

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
        setComponent(
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
        );
      } catch (err) {}
    };
    fetchCourse();
  }, [sendRequest, url, getToken]);

  useEffect(() => {
    if (courseId) {
      // alert("courseID found");
      // let url2 = "http://localhost:5000/api/admin/get-teacher-list/";
      let url2 =
        "http://localhost:5000/api/admin/get-available-teachers-for-a-course/" +
        courseId;
      const fetchTeachers = async () => {
        try {
          const responseData = await sendRequest(url2, "GET", null, {
            Authorization: "Bearer " + getToken,
          });
          console.log(responseData);
          // alert(responseData.teachers.length);
          // setInstructorList(responseData.users);
          // if (teachersList.length === 0) {
          teachersList = [];
          responseData.availableTeachers.map((user) =>
            teachersList.push({
              id: user._id,
              moodleID: user.moodleID,
              name: user.name,
            })
          );
          // }
          setLoadedTeachersList(responseData.availableTeachers);
          // alert("setting 2");
          setComponent2(
            <Grid item>
              <Autocomplete
                id="place-select"
                sx={{ width: 300 }}
                value={teacherId}
                onChange={(event, newValue) => {
                  console.log("ass: ", newValue.id);
                  setTeacherId(newValue.moodleID);
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
                    label="Choose a Teacher"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Grid>
          );
        } catch (err) {}
      };

      fetchTeachers();
    }
  }, [sendRequest, getToken, courseId]);

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
              Individual Teacher-Course Assignment Panel
            </Typography>
          </Paper>
        </Grid>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid item container spacing={2}>
            <Grid item sm={3.5} />
            {component}
            {component2}
            {/* {!isLoading && loadedCourseList && (
              
            )} */}

            {/* {!isLoading && loadedTeachersList && (
              
            )} */}

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
                Assign Teacher
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
