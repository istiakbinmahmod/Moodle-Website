import { Grid, Typography, Card, CardContent, Paper } from "@mui/material";
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { storage } from "../Firebase_/Conf";
import useStyles from "../Dashboard/StudentDashboard/StudentDashboardStyle";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "../Dashboard/Sidebar";

import { useState, useEffect, useContext } from "react";
import AttachmentIcon from "@mui/icons-material/AttachFile";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
// import Person from "@material-ui/icons/Person";
import { Person } from "@mui/icons-material";
import Divider from "@material-ui/core/Divider";
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

const UploadPrivateFiles = (props) => {
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

  const [userFile, setUserFile] = useState(null);
  const [fileurl, setUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (option === "course") {
      navigate("/student/my-courses", {
        state: {
          courses: userCourses,
        },
      });
    } else if (option === "profile") {
      navigate("/student/profile", {});
    } else if (option === "edit-profile") {
      navigate("/student/edit-profile");
    } else if (option === "logout") {
      console.log("logout clicked");
      auth.logout();
      navigate("/");
    } else if (option === "private-files") {
      navigate("/student/private-files");
    } else if (option === "upload-private-files") {
      navigate("/student/upload-private-files");
    } else if (option === "notification") {
      navigate("/student/notifications");
    }
  }, [option, userCourses]);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setUserFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (userFile) {
      const fileName = userFile.name;
      const uploadTask = storage
        .ref(`whiteboard/private-files/${fileName}`)
        .put(userFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progres = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progres);
        },

        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref(`whiteboard/private-files`)
            .child(fileName)
            .getDownloadURL()
            .then((url) => {
              setUrl(url);
            });
        }
      );
    }
  }, [userFile]);

  useEffect(() => {
    if (progress === 100) {
      setDisabled(false);
    }
  }, [progress]);

  const uploadFile = async (event) => {
    event.preventDefault();
    try {
      let url;
      url =
        "http://localhost:5000/api/users/upload-private-file/" +
        localStorage.getItem("userId");
      await sendRequest(
        url,
        "POST",
        JSON.stringify({
          url: fileurl,
          filename: userFile.name,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      // alert("File Uploaded Successfully");
      window.location.reload();
      // navigate("/");
    } catch (error) {
      alert("File Upload Failed");
    }
  };

  return (
    <div className={classes.root}>
      <Sidebar setOption={setOption} />
      <main className={classes.content}>
        <Box
          style={{
            position: "absolute",
            left: "50%",
            top: "20%",
            transform: "translate(-50%, -50%)",
          }}
          // display="flex"
          // justifyContent="center"
          // alignItems="center"
          // minHeight="100vh"
        >
          <List
          // direction="column" alignItems="center" justifyContent="center"
          >
            <ListItem>
              <Grid item>
                <Typography
                  sx={{
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    color: "blue",
                    font: "caption",
                  }}
                >
                  Upload Private Files
                </Typography>
              </Grid>
            </ListItem>
            <ListItem>
              <Grid item>
                <Stack>
                  <Button
                    variant="outlined"
                    component="label"
                    color="primary"
                    style={{
                      margin: "auto",
                      marginTop: "20px",
                      marginBottom: "20px",
                      width: "200px",
                      height: "50px",
                      borderRadius: "100px",
                    }}
                    endIcon={<AttachmentIcon />}
                  >
                    Upload File
                    <input
                      hidden
                      multiple
                      type="file"
                      onChangeCapture={handleChange}
                    />
                  </Button>

                  <Grid item container>
                    <Grid item sm={3}></Grid>
                    <Grid item>
                      <Typography variant="h5">
                        <progress value={progress} max="100" /> {progress}%
                      </Typography>
                      <Typography variant="h5">
                        File: {userFile ? userFile.name : "No file selected"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
            </ListItem>
            <ListItem>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "20px", marginBottom: "20px" }}
                  disabled={disabled}
                  onClick={uploadFile}
                >
                  Upload File
                </Button>
              </Grid>
            </ListItem>
          </List>
        </Box>

        {!isLoading && userInfo && (
          <>
            <Grid container direction="column" spacing={2}>
              <Grid item container spacing={2}>
                <Grid item sm={1} />

                <Grid item container spacing={2}>
                  <Grid item sm={1} />
                </Grid>
                <Grid item container>
                  <Grid item sm={5} />

                  <Grid item sm={5} />
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </main>
    </div>
  );
};

export default UploadPrivateFiles;
