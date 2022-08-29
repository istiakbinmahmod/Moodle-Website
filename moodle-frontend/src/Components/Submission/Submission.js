import {
  Grid,
  Paper,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  ListItem,
} from "@mui/material";
import { React, useState, useEffect, useContext } from "react";
import { storage } from "../Firebase_/Conf";
import AttachmentIcon from "@mui/icons-material/AttachFile";
import { AuthContext } from "../Context/AuthContext";
import { useHttpClient } from "../Context/http-hook";
import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";

const formatDate = (date) => {
  // format to i.e 6 jan, saturday at 3:00pm
  var d = new Date(date);
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  var n = weekday[d.getDay()];
  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";

  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  var mon = month[d.getMonth()];
  var day = d.getDate();
  var year = d.getFullYear();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  var ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12; // the hour '0' should be '12'
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  var strTime =
    n +
    ", " +
    mon +
    " " +
    day +
    ", " +
    year +
    " at " +
    h +
    ":" +
    m +
    ":" +
    s +
    " " +
    ampm;
  // var date = new Date(year, mon, day, h, m, s);
  // var date = n + ", " + mon + +day + ", " + year + " at " + h + ":" + m;
  // return strTime;
  return [strTime, d];
};

const SubmitAssignment = (props) => {
  const stdId = 5;
  const { assignmentId, studentId } = props;
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const getToken = localStorage.getItem("token");
  const [loadedAssignment, setLoadedAssignment] = useState();
  const [file, setFile] = useState(null);

  const [fileurl, setUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [disabled, setDisabled] = useState(true);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  //get assignment by assignment id
  useEffect(() => {
    let url =
      "http://localhost:5000/api/students/get-course-assignment/" +
      assignmentId;
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
  }, [assignmentId]);

  useEffect(() => {
    // console.log("file: ",file);
    if (file) {
      const fileName = file.name + "_" + stdId + "_" + assignmentId;
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
              console.log(url);
              setUrl(url);
            });
        }
      );
    }
  }, [file]);

  useEffect(() => {
    if (progress === 100) {
      setDisabled(false);
    }
  }, [progress]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let url;
      url =
        "http://localhost:5000/api/students/upload-submission/" + assignmentId;
      await sendRequest(
        url,
        "POST",
        JSON.stringify({
          url: fileurl,
          filename: file.name,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      alert("Submission uploaded successfully");
      window.location.reload();
    } catch (error) {}
  };

  return (
    <Grid Container direction="column">
      {loadedAssignment && (
        <List>
          <ListItem>
            <Typography variant="h5">
              Assignment Title : {loadedAssignment.title}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Description : {loadedAssignment.description}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Deadline : {formatDate(loadedAssignment.dueDate)[0]}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Cutoff Time : {formatDate(loadedAssignment.cutOffDate)[0]}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Assignment File:{" "}
              <a href={loadedAssignment.file} download>
                {loadedAssignment.title}
              </a>
            </Typography>
          </ListItem>
        </List>
      )}
      <Grid item>
        <Paper
          sx={{
            backgroundColor: "#D6D7D7",
            paddingTop: "30px",
            paddingBottom: "30px",
          }}
        >
          <center>
            <Typography variant="h5">Submission Panel</Typography>
          </center>
        </Paper>
      </Grid>

      {loadedAssignment &&
        (new Date() > formatDate(loadedAssignment.cutOffDate)[1] ? (
          <Typography variant="body1">
            Sorry, you have passed the deadline for this assignment.
          </Typography>
        ) : (
          <>
            <Grid item container spacing={2}>
              {/* put a file upload butto */}
              <Grid item xs={1} />
              <Grid item xs={5}>
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

                  <Grid item container>
                    <Grid item sm={3}></Grid>
                    <Grid item>
                      {/* add progress bar which is circular */}

                      <Typography variant="h5">
                        <progress value={progress} max="100" /> {progress}%
                      </Typography>
                      <Typography variant="h5">
                        File: {file ? file.name : "No file selected"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  component="label"
                  color="primary"
                  style={{
                    margin: "auto",
                    marginTop: "20px",
                    marginBottom: "20px",
                    width: "400px",
                    height: "50px",
                  }}
                  disabled={disabled}
                  onClick={handleSubmit}
                >
                  Turn In Your Assignment
                </Button>
              </Grid>
            </Grid>
          </>
        ))}
    </Grid>
  );
};

export default SubmitAssignment;
