import {
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
} from "@mui/material";
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ListSubheader from "@material-ui/core/ListSubheader";

import { makeStyles } from "@material-ui/core/styles";
import { storage } from "../Firebase_/Conf";
import useStyles from "../Dashboard/StudentDashboard/StudentDashboardStyle";
import { useState, useEffect, useContext } from "react";
import AttachmentIcon from "@mui/icons-material/AttachFile";
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
  Stack,
} from "@mui/material";
import LibraryAddTwoToneIcon from "@mui/icons-material/LibraryAddTwoTone";

import { AuthContext } from "../../Components/Context/AuthContext";
import { useHttpClient } from "../../Components/Context/http-hook";
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

const AddForumPost = (props) => {
  const classes = useStyles();
  const newClasses = newStyles();
  const auth = useContext(AuthContext);
  const { courseID, courseTitle } = props;
  const getToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const userID = localStorage.getItem("userId");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [userInfo, setUserInfo] = useState();
  const [userCourses, setUserCourses] = useState([]);
  const [component, setComponent] = useState(<div></div>);
  const [option, setOption] = useState("");

  const [newPostTitle, setNewPostTitle] = useState();
  const [newPostDesc, setNewPostDesc] = useState();

  useEffect(() => {
    const url =
      "http://localhost:5000/api/users/" + localStorage.getItem("userId");
    const fetchUserInfo = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setUserInfo(responseData.user);
        console.log(responseData.user);
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

  const addPost = async (event) => {
    event.preventDefault();
    try {
      let url_path;
      url_path =
        "http://localhost:5000/api/users/post/" +
        courseID +
        "/" +
        localStorage.getItem("userId");
      await sendRequest(
        url_path,
        "POST",
        JSON.stringify({
          title: newPostTitle,
          postDescription: newPostDesc,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      alert("New Post Added!");
      navigate(
        "/teacher/my/course/" + courseTitle + "/" + courseID + "/forum",
        {
          state: {
            courseID: courseID,
            courseTitle: courseTitle,
          },
        }
      );
    } catch (error) {
      alert("Post not added");
    }
  };

  return (
    <div className={classes.root}>
      <Sidebar setOption={setOption} />
      <main className={classes.content}>
        {!isLoading && userInfo && (
          // <Box component="span" sx={{ p: 2, border: "1px dashed grey" }}>
          <>
            <List dense>
              <ListItem>
                <Grid item>
                  <Typography
                    sx={{
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      paddingTop: "20px",
                      paddingBottom: "20px",
                      color: "black",
                      font: "caption",
                      variant: "h1",
                    }}
                  >
                    Create new Forum Post
                  </Typography>
                  {/* </Paper> */}
                </Grid>
              </ListItem>
              <ListItem>
                <Grid item>
                  <TextField
                    id="outlined-basic"
                    label="Post Title"
                    variant="outlined"
                    sx={{ minWidth: 600, bgcolor: "#f5f5f5" }}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    style={{ bgcolor: "#f5f5f5" }}
                    size="big"
                  />
                </Grid>
              </ListItem>
              <ListItem>
                <Grid item>
                  <TextField
                    id="outlined-basic"
                    label="Post Description"
                    variant="outlined"
                    sx={{ minWidth: 600, bgcolor: "#f5f5f5" }}
                    onChange={(e) => setNewPostDesc(e.target.value)}
                    style={{ bgcolor: "#f5f5f5" }}
                    size="big"
                  />
                </Grid>
              </ListItem>
              <ListItem>
                {/* <Grid item> */}
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "20px", marginBottom: "20px" }}
                  // disabled={disabled}
                  onClick={addPost}
                >
                  Add Post
                </Button>
                {/* </Grid> */}
              </ListItem>
            </List>

            {/* <Grid item container spacing={2}>
                  <Grid item container spacing={2}>
                    <Grid item sm={1} />
  
                    <Grid item sm={1} />
                  </Grid>
                  <Grid item container>
                    <Grid item sm={3} />
  
                    <Grid item sm={3} />
                  </Grid>
  
                  <Grid item container>
                    <Grid item sm={3} />
  
                    <Grid item sm={3} />
                  </Grid>
                  <Grid item container>
                    <Grid item sm={5} />
  
                    <Grid item sm={5} />
                  </Grid>
                </Grid>
              </Grid> */}
          </>
          // </Box>
        )}
      </main>
    </div>
  );
};

export default AddForumPost;
