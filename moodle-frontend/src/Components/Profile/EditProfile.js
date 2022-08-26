import { Grid, Typography, Card, CardContent, Paper } from "@mui/material";
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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

const EditProfile = (props) => {
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

  const [userName, setUserName] = useState();
  const [userImage, setUserImage] = useState(null);
  const [url, setUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [userPhone, setUserPhone] = useState();
  const [userAddress, setUserAddress] = useState();
  const [userRole, setUserRole] = useState();
  const [userBio, setUserBio] = useState();
  const [disabled, setDisabled] = useState(true);

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

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setUserImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    console.log("userImage: ", userImage);
    if (userImage) {
      const fileName = userImage.name;
      const uploadTask = storage
        .ref(`whiteboard/profile-pic/${fileName}`)
        .put(userImage);

      // const uploadTask = storage.ref(`whiteboardfiles/${file.name}`).put(file);
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
            .ref(`whiteboard/profile-pic`)
            .child(fileName)
            .getDownloadURL()
            .then((url) => {
              console.log(url);
              setUrl(url);
            });
        }
      );
    }
  }, [userImage]);

  useEffect(() => {
    if (progress === 100) {
      setDisabled(false);
    }
  }, [progress]);

  const editProfile = async (event) => {
    event.preventDefault();
    try {
      let url_path;
      url_path =
        "http://localhost:5000/api/users/update-profile/" +
        localStorage.getItem("userId");
      await sendRequest(
        url_path,
        "PATCH",
        JSON.stringify({
          url: url,
          name: userName,
          phone: userPhone,
          address: userAddress,
          bio: userBio,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      alert("Profile Updated");
      localStorage.getItem("userRole") === "student"
        ? navigate("/student/profile")
        : navigate("/teacher/profile");
      // navigate("/");
    } catch (error) {
      alert("Profile not updated");
    }
  };

  return (
    <div className={classes.root}>
      <Sidebar setOption={setOption} />
      <main className={classes.content}>
        {!isLoading && userInfo && (
          <>
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
                    Update Profile
                  </Typography>
                </Paper>
              </Grid>

              <Grid item container spacing={2}>
                <Grid item sm={1} />
                <Grid item>
                  <TextField
                    id="outlined-basic"
                    label="Username"
                    variant="outlined"
                    defaultValue={userInfo.name}
                    onChange={(e) => setUserName(e.target.value)}
                    style={{ bgcolor: "#f5f5f5" }}
                  />
                </Grid>

                <Grid item container spacing={2}>
                  <Grid item sm={1} />
                  <Grid item>
                    <TextField
                      id="outlined-basic"
                      label="Address"
                      variant="outlined"
                      defaultValue={userInfo.address}
                      onChange={(e) => setUserAddress(e.target.value)}
                      style={{ bgcolor: "#f5f5f5" }}
                    />
                  </Grid>

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
                        Upload Image
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
                            File:{" "}
                            {userImage ? userImage.name : "No file selected"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Grid>

                  <Grid item sm={1} />
                </Grid>
                <Grid item container>
                  <Grid item sm={3} />
                  <Grid item>
                    <TextField
                      id="outlined-basic"
                      label="Phone Number"
                      variant="outlined"
                      multiline
                      maxRows={10}
                      sx={{ minWidth: 600, bgcolor: "#f5f5f5" }}
                      // value={desc}
                      placeholder={userInfo.phone}
                      onChange={(e) => setUserPhone(e.target.value)}
                    />
                  </Grid>
                  <Grid item sm={3} />
                </Grid>

                <Grid item container>
                  <Grid item sm={3} />
                  <Grid item>
                    <TextField
                      id="outlined-basic"
                      label="Bio"
                      variant="outlined"
                      multiline
                      maxRows={10}
                      sx={{ minWidth: 600, bgcolor: "#f5f5f5" }}
                      // value={desc}
                      defaultValue={userInfo.moodleID}
                      onChange={(e) => setUserBio(e.target.value)}
                    />
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
                      disabled={disabled}
                      onClick={editProfile}
                    >
                      Update Profile
                    </Button>
                  </Grid>
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

export default EditProfile;
