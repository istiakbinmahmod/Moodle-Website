import { Grid, Typography, Card, CardContent, Paper } from "@mui/material";
import React from "react";

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

const CreateCourseMat = (props) => {
  //   const [courseId, setCourseId] = useState("");
  const { courseID } = props;
  const [desc, setDesc] = useState("No Description Added!");

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //assignmentName, assignmentDescription, acitivityInstruction, assignmentFile, assignmentDueTime
  const [materialName, setMaterialName] = useState("");
  const [materialFile, setMaterialFile] = useState(null);

  const uploadMaterial = async (event) => {
    event.preventDefault();
    try {
      let url;
      url = "http://localhost:5000/api/teachers/upload-material/" + courseID;
      const formData = new FormData();
      // formData.append("file", assignment_file);
      formData.append("file", materialFile);
      formData.append("title", materialName);

      console.log(formData.values);
      await sendRequest(url, "POST", formData, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });

      // navigate("/");
    } catch (error) {}
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
              label="Material Title"
              variant="outlined"
              //   value={assTitle}
              onChange={(e) => setMaterialName(e.target.value)}
              style={{ bgcolor: "#f5f5f5" }}
            />
          </Grid>

          <Grid item>
            {/* make a fancy file input button and take the file */}
            <input
              type="file"
              onChange={(e) => setMaterialFile(e.target.files[0])}
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
              onClick={uploadMaterial}
            >
              Upload Material
            </Button>
          </Grid>
          <Grid item sm={5} />
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateCourseMat;
