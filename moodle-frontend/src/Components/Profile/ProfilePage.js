import {
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
  Avatar,
} from "@mui/material";
import React from "react";

import { Link, NavLink, useNavigate } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { Person } from "@mui/icons-material";
import Divider from "@material-ui/core/Divider";

import { useState, useEffect, useContext } from "react";
import {
  Button,
  TextField,
  Box,
  Autocomplete,
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

import { AuthContext } from "../../Components/Context/AuthContext";
import { useHttpClient } from "../../Components/Context/http-hook";
import useStyles from "../Dashboard/StudentDashboard/StudentDashboardStyle";
import Sidebar from "../Dashboard/Sidebar";

const newStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 900,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
  }),
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle,
  },
}));

const Profile = (props) => {
  const classes = useStyles();
  const newClasses = newStyles();
  const auth = useContext(AuthContext);
  const getToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const userID = localStorage.getItem("userId");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [userInfo, setUserInfo] = useState();
  const [userCourses, setUserCourses] = useState([]);
  const [component, setComponent] = useState(<div></div>);
  const [option, setOption] = useState("");

  useEffect(() => {
    const url =
      "http://localhost:5000/api/users/" + localStorage.getItem("userId");
    const fetchUserInfo = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setUserInfo(responseData.user);
      } catch (err) {}
    };
    fetchUserInfo();
  }, [sendRequest]);

  useEffect(() => {
    const url =
      localStorage.getItem("userRole") === "student"
        ? "http://localhost:5000/api/students/get-my-courses"
        : "http://localhost:5000/api/teachers/get-my-courses";
    const fetchUserCourses = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setUserCourses(responseData.courses);
      } catch (err) {}
    };
    fetchUserCourses();
  }, [sendRequest]);

  useEffect(() => {
    if (option === "course") {
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/my-courses"
          : "/teacher/my-courses",
        {
          state: {
            courses: userCourses,
          },
        }
      );
    } else if (option === "profile") {
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/profile"
          : "/teacher/profile",
        {}
      );
    } else if (option === "edit-profile") {
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/edit-profile"
          : "/teacher/edit-profile"
      );
    } else if (option === "private-files") {
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/private-files"
          : "/teacher/private-files"
      );
    } else if (option === "logout") {
      auth.logout();
      navigate("/");
    } else if (option === "upload-private-files") {
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/upload-private-files"
          : "/teacher/upload-private-files"
      );
    } else if (option === "notification") {
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/notifications"
          : "/teacher/notifications"
      );
    }
  }, [option, userCourses]);

  return (
    <div className={classes.root}>
      <Sidebar setOption={setOption} />
      <main className={classes.content}>
        {!isLoading && userInfo && (
          <Paper className={newClasses.root} elevation={4}>
            <Typography variant="h6" className={newClasses.title}>
              Profile
            </Typography>
            <List dense>
              <ListItem>
                {userInfo.image ? (
                  // <img src={userInfo.image} />
                  <ListItemAvatar>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                ) : (
                  <ListItemAvatar>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                )}

                <ListItemText>
                  <Typography>
                    <h3>{userInfo.name}</h3>
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Typography>
                    <h3>User Details :</h3>
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>Email Address : {userInfo.email}</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>Country : Bangladesh</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>City/Town : Dhaka</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>Contact Number : {userInfo.phone}</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>Country : Bangladesh</ListItemText>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText>
                  <Typography>
                    <h3>Bio :</h3>
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>{userInfo.bio}</ListItemText>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText>
                  <Typography>
                    <h3>Course Details :</h3>
                  </Typography>
                </ListItemText>
              </ListItem>
              {!isLoading &&
                userCourses &&
                userCourses.map((course) => (
                  <ListItem>
                    <ListItemText>
                      <Typography>
                        {course.sessionName} {course.courseID} :{" "}
                        {course.courseTitle}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                ))}
            </List>
          </Paper>
        )}
      </main>
    </div>
  );
};

export default Profile;
