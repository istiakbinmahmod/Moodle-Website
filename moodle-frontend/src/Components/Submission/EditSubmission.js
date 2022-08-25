import {
  Grid,
  Paper,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { React, useState, useEffect, useContext } from "react";
import { storage } from "../Firebase_/Conf";
import AttachmentIcon from "@mui/icons-material/AttachFile";
import { ContentPasteSearchOutlined } from "@mui/icons-material";
import { AuthContext } from "../Context/AuthContext";
import { useHttpClient } from "../Context/http-hook";

const SubmitAssignment = (props) => {
  const { assignmentId, studentId } = props;
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const getToken = localStorage.getItem("token");

  const [file, setFile] = useState(null);
  const [prevSubmissionFile, setPrevSubmissionFile] = useState();
  const [url, setUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [disabled, setDisabled] = useState(true);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchPrevSubmission = async () => {
      const url =
        "http://localhost:5000/api/students/get-submission/" + assignmentId;
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setPrevSubmissionFile(responseData.submission);
        // console.log(responseData.submission);
      } catch (err) {}
    };
    fetchPrevSubmission();
  }, [sendRequest, getToken]);

  useEffect(() => {
    if (file) {
      const fileName = file.name /*+ "_" + stdId */ + "_" + assignmentId;
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
  // url, file
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let url;
      url =
        "http://localhost:5000/api/students/update-submission/" + assignmentId;
      // const formData = new FormData();

      // formData.append("file", assignment_file);
      // formData.append("url", url);
      // formData.append("")

      // console.log(formData);
      await sendRequest(
        url,
        "PATCH",
        JSON.stringify({
          url: url,
          filename: file.name,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      // navigate("/");
    } catch (error) {}
  };

  return (
    <Grid Container direction="column">
      <Grid item>
        <Paper
          sx={{
            backgroundColor: "#D6D7D7",
            paddingTop: "30px",
            paddingBottom: "30px",
          }}
        >
          <center>
            <Typography variant="h5">Your Submissions</Typography>
          </center>
        </Paper>
      </Grid>

      <Grid item container spacing={2}>
        {/* put a file upload butto */}
        <Grid item xs={1} />
        {prevSubmissionFile && (
          <Grid item xs={3}>
            <Typography>{prevSubmissionFile.filename}</Typography>
          </Grid>
        )}
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
            Update Submission
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SubmitAssignment;
