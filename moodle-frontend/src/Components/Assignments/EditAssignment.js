import { Grid, Typography, Card, CardContent, Paper } from "@mui/material";
import React, { useContext } from "react";
import Sidebar from "../Dashboard/Sidebar";
import { storage } from "../Firebase_/Conf";
import { Link, useNavigate } from "react-router-dom";
import useStyles from "../Dashboard/StudentDashboard/StudentDashboardStyle";
import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Autocomplete,
  InputLabel,
  Select,
  MenuItem,
  Input,
  Stack,
  InputAdornment,
  IconButton,
  FormHelperText,
  FormLabel,
  RadioGroup,
  Radio,
  FormGroup,
  FormControl,
} from "@mui/material";
import AttachmentIcon from "@mui/icons-material/AttachFile";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
// import Person from "@material-ui/icons/Person";
import { CheckBox, Person } from "@mui/icons-material";
import Divider from "@material-ui/core/Divider";
import Checkbox from "@mui/material";

import LibraryAddTwoToneIcon from "@mui/icons-material/LibraryAddTwoTone";

import { AuthContext } from "../../Components/Context/AuthContext";
import { useHttpClient } from "../../Components/Context/http-hook";

const EditAss = (props) => {
  //   const [courseId, setCourseId] = useState("");
  const { courseID, courseTitle, assignmentID } = props;
  const [loadedAssignment, setLoadedAssignment] = useState();

  const navigate = useNavigate();
  const [option, setOption] = useState("");
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [file, setFile] = useState(null);
  const [fileUrl, setUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [disabled, setDisabled] = useState(true);

  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [activityInstruction, setActivityInstruction] = useState("");
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [cutOffDate, setCutOffDate] = useState("");

  useEffect(() => {
    let url =
      "http://localhost:5000/api/teachers/get-course-assignment/" +
      assignmentID;
    const fetchAss = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + auth.token,
        });
        console.log(responseData);
        setLoadedAssignment(responseData.assignment);
      } catch (err) {}
    };
    fetchAss();
  }, [courseID, courseTitle, assignmentID]);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  useEffect(() => {
    // console.log("file: ",file);
    if (file) {
      const fileName = file.name;
      const uploadTask = storage
        .ref(`whiteboard/submissions/${fileName}`)
        .put(file);

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
            .ref(`whiteboard/submissions`)
            .child(fileName)
            .getDownloadURL()
            .then((url) => {
              alert("url is ", url);
              setUrl(url);
            });
        }
      );
    }
  }, [file]);

  const updateAssignment = async (event) => {
    event.preventDefault();
    alert(fileUrl);
    try {
      let url;
      url =
        "http://localhost:5000/api/teachers/update-course-assignment/" +
        assignmentID;
      await sendRequest(
        url,
        "POST",
        JSON.stringify({
          url: fileUrl,
          title: assignmentName,
          description: assignmentDescription,
          dueDate: dueDate,
          cutOffDate: cutOffDate,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      alert("assignment updated");
      navigate(
        "/teacher/my/course/" + courseTitle + "/" + courseID + "/assignments",
        {
          state: {
            courseID: courseID,
            courseTitle: courseTitle,
          },
        }
      );
      //
      // navigate("/");
    } catch (error) {
      //
    }
  };

  return (
    <>
      <div className={classes.root}>
        <Sidebar setOption={setOption} />
        <main className={classes.content}>
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
                    variant: "h3",
                  }}
                >
                  Update Assignment
                </Typography>
                {/* </Paper> */}
              </Grid>
            </ListItem>
            {loadedAssignment && (
              <>
                <ListItem>
                  <Grid item>
                    <TextField
                      id="outlined-basic"
                      label="Assignment Title"
                      variant="outlined"
                      //   value={assTitle}
                      defaultValue={loadedAssignment.title}
                      sx={{ minWidth: 600, bgcolor: "#f5f5f5" }}
                      onChange={(e) => setAssignmentName(e.target.value)}
                      // style={{ bgcolor: "#f5f5f5" }}
                      size="big"
                    />
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid item>
                    <TextField
                      id="outlined-basic"
                      label="Due Date"
                      variant="outlined"
                      // value={dueDate}
                      sx={{ minWidth: 600, bgcolor: "#f5f5f5" }}
                      type="datetime-local"
                      placeholder={loadedAssignment.dueDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid item>
                    <TextField
                      id="outlined-basic"
                      label="Cutoff Date"
                      variant="outlined"
                      // value={dueDate}
                      sx={{ minWidth: 600, bgcolor: "#f5f5f5" }}
                      defaultValue={loadedAssignment.cutOffDate}
                      type="datetime-local"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => setCutOffDate(e.target.value)}
                    />
                  </Grid>
                </ListItem>
              </>
            )}
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
                    Attach File
                    <input
                      hidden
                      multiple
                      type="file"
                      onChangeCapture={handleChange}
                    />
                  </Button>

                  {loadedAssignment && (
                    <Grid item container>
                      <Grid item sm={3}></Grid>
                      <Grid item>
                        {/* add progress bar which is circular */}

                        <Typography variant="h5">
                          <progress value={progress} max="100" /> {progress}%
                        </Typography>
                        <Typography variant="h5">
                          {file ? "File: " + file.name : loadedAssignment.file}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </Stack>
              </Grid>
            </ListItem>
            {loadedAssignment && (
              <>
                <ListItem>
                  <Grid item>
                    <TextField
                      id="outlined-basic"
                      label="Description"
                      variant="outlined"
                      multiline
                      maxRows={10}
                      sx={{ minWidth: 600, bgcolor: "#f5f5f5" }}
                      // value={desc}
                      defaultValue={loadedAssignment.description}
                      onChange={(e) => setAssignmentDescription(e.target.value)}
                    />
                  </Grid>
                </ListItem>
              </>
            )}
            <ListItem>
              <Grid item>
                {/* <Checkbox
                  // checked={checked}
                  // onChange={handleChange}
                  inputProps={{ "aria-label": "controlled" }}
                /> */}
                {/* <TextField
                  id="outlined-basic"
                  label="Activity Instruction"
                  variant="outlined"
                  multiline
                  maxRows={10}
                  sx={{ minWidth: 600, bgcolor: "#f5f5f5" }}
                  // value={desc}
                  onChange={(e) => setActivityInstruction(e.target.value)}
                /> */}
              </Grid>
            </ListItem>
            <ListItem>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "20px", marginBottom: "20px" }}
                  onClick={updateAssignment}
                >
                  Edit Assignment
                </Button>
              </Grid>
            </ListItem>
          </List>
        </main>
      </div>
    </>
  );
};

export default EditAss;
