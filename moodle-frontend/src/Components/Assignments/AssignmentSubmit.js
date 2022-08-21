import { Grid, Typography, Card, CardContent, Paper } from "@mui/material";
import React from "react";

import useStyles from "../Dashboard/Teams/TeamsStyle";
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

const AssignmentSubmit = (props) => {
  //   const [courseId, setCourseId] = useState("");
  const { courseID, assignmentID } = props;
  const [desc, setDesc] = useState("No Description Added!");

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //assignmentName, assignmentDescription, acitivityInstruction, assignmentFile, assignmentDueTime
  const [submissionFile, setSubmissionFile] = useState("");

  const uploadSubmission = async (event) => {
    event.preventDefault();
    try {
      let url =
        "http://localhost:5000/api/students/upload-submission/" + assignmentID;
      const formData = new FormData();
      formData.append("file", submissionFile);
      await sendRequest(url, "POST", formData, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      //
      // navigate("/");
    } catch (error) {
      //
    }
  };

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
              Upload Submission
            </Typography>
          </Paper>
        </Grid>

        <Grid item container spacing={2}>
          <Grid item sm={1} />

          <Grid item>
            {/* make a fancy file input button and take the file */}
            <input
              type="file"
              onChange={(e) => setSubmissionFile(e.target.files[0])}
            />
            {/* put a text with ash back ground */}

            <Button variant="contained" color="primary">
              Attach
            </Button>
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
              onClick={uploadSubmission}
            >
              Upload Submission
            </Button>
          </Grid>
          <Grid item sm={5} />
        </Grid>
      </Grid>
    </div>
  );
};

export default AssignmentSubmit;
