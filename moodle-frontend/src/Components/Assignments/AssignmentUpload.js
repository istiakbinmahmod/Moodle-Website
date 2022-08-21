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

const CreateAss = (props) => {
  //   const [courseId, setCourseId] = useState("");
  const { courseID } = props;
  const [desc, setDesc] = useState("No Description Added!");

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //assignmentName, assignmentDescription, acitivityInstruction, assignmentFile, assignmentDueTime
  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [activityInstruction, setActivityInstruction] = useState("");
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [assignmentDueTime, setAssignmentDueTime] = useState("");

  const [dueDate, setDueDate] = useState("");
  const [cutOffDate, setCutOffDate] = useState("");

  const [assFile, setAssFile] = useState(null);
  const [grade, setGrade] = useState();
  const grades = ["five", "six", "seven", "eight", "nine", "ten"];

  const uploadAssignment = async (event) => {
    event.preventDefault();
    try {
      let url;
      url =
        "http://localhost:5000/api/teachers/upload-course-assignment/" +
        courseID;
      const formData = new FormData();
      // formData.append("file", assignment_file);
      formData.append("file", assignmentFile);
      formData.append("title", assignmentName);
      formData.append("description", assignmentDescription);
      formData.append("activity_instruction", activityInstruction);
      formData.append("dueDate", dueDate);
      formData.append("cutOffDate", cutOffDate);

      console.log(formData.values);
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
              Create Assignment
            </Typography>
          </Paper>
        </Grid>

        <Grid item container spacing={2}>
          <Grid item sm={1} />
          <Grid item>
            <TextField
              id="outlined-basic"
              label="Assignment Title"
              variant="outlined"
              //   value={assTitle}
              onChange={(e) => setAssignmentName(e.target.value)}
              style={{ bgcolor: "#f5f5f5" }}
            />
          </Grid>

          <Grid item>
            <TextField
              id="outlined-basic"
              label="Due Date"
              variant="outlined"
              // value={dueDate}
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Grid>

          <Grid item>
            <TextField
              id="outlined-basic"
              label="Cutoff Date"
              variant="outlined"
              // value={dueDate}
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setCutOffDate(e.target.value)}
            />
          </Grid>

          <Grid item>
            {/* make a fancy file input button and take the file */}
            <input
              type="file"
              onChange={(e) => setAssignmentFile(e.target.files[0])}
            />
            {/* put a text with ash back ground */}

            <Button variant="contained" color="primary">
              Attach
            </Button>
          </Grid>

          <Grid item sm={1} />
        </Grid>
        <Grid item container>
          <Grid item sm={3} />
          <Grid item>
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              multiline
              maxRows={10}
              sx={{ minWidth: 600, bgcolor: "#f5f5f5" }}
              // value={desc}
              onChange={(e) => setAssignmentDescription(e.target.value)}
            />
          </Grid>
          <Grid item sm={3} />
        </Grid>

        <Grid item container>
          <Grid item sm={3} />
          <Grid item>
            <TextField
              id="outlined-basic"
              label="Activity Instruction"
              variant="outlined"
              multiline
              maxRows={10}
              sx={{ minWidth: 600, bgcolor: "#f5f5f5" }}
              // value={desc}
              onChange={(e) => setActivityInstruction(e.target.value)}
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
              onClick={uploadAssignment}
            >
              Create Assignment
            </Button>
          </Grid>
          <Grid item sm={5} />
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateAss;
