import { Grid, Typography, Card, CardContent, Paper } from "@mui/material";
import React from "react";
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

const UploadPrivateFiles = (props) => {
  const auth = useContext(AuthContext);
  const userID = localStorage.getItem("userId");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const getToken = localStorage.getItem("token");
  const [userInfo, setUserInfo] = useState();

  const [userName, setUserName] = useState();
  const [userFile, setUserFile] = useState(null);
  const [url, setUrl] = useState(null);
  const [progress, setProgress] = useState(0);
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
      } catch (err) {}
    };
    fetchUserInfo();
  }, [sendRequest]);

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
      url = "http://localhost:5000/api/users/upload-private-file/";
      await sendRequest(
        url,
        "POST",
        JSON.stringify({
          url: url,
          filename: userFile.name,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      alert("File Uploaded Successfully");
      // navigate("/");
    } catch (error) {
      alert("File Upload Failed");
    }
  };

  return (
    <div>
      {!isLoading && userInfo && (
        <>
          <Grid container direction="column" spacing={2}>
            <Grid item>
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
                  Upload Private Files
                </Typography>
              </Paper>
            </Grid>

            <Grid item container spacing={2}>
              <Grid item sm={1} />

              <Grid item container spacing={2}>
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

                <Grid item sm={1} />
              </Grid>
              <Grid item container>
                <Grid item sm={5} />
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "20px", marginBottom: "20px" }}
                    disabled={disabled}
                    onClick={uploadFile}
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
    </div>
  );
};

export default UploadPrivateFiles;
