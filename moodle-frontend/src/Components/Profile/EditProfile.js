import { Grid, Typography, Card, CardContent, Paper } from "@mui/material";
import React from "react";

import useStyles from "../Dashboard/StudentDashboard/StudentDashboardStyle";
import { useState, useEffect, useContext } from "react";
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

const EditProfile = (props) => {
  console.log("profile entered");
  const auth = useContext(AuthContext);
  const userID = localStorage.getItem("userId");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //userName, userImage, userPhone, userAddress, userRole, userPassword, userBio
  const [userName, setUserName] = useState();
  const [userImage, setUserImage] = useState();
  const [userPhone, setUserPhone] = useState();
  const [userAddress, setUserAddress] = useState();
  const [userRole, setUserRole] = useState();
  const [userBio, setUserBio] = useState();

  const editProfile = async (event) => {
    event.preventDefault();
    try {
      let url;
      url = "http://localhost:5000/api/users/update-profile/";
      // +localStorage.getItem("userId");
      const formData = new FormData();
      // formData.append("file", assignment_file);
      formData.append("file", userImage);
      formData.append("name", userName);
      formData.append("phone", userPhone);
      formData.append("address", userAddress);
      formData.append("bio", userBio);
      //   +console.log(formData.values);
      await sendRequest(url, "PATCH", formData, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      alert("Profile Updated");
      // navigate("/");
    } catch (error) {
      alert("Profile not updated");
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
              //   value={assTitle}
              onChange={(e) => setUserName(e.target.value)}
              style={{ bgcolor: "#f5f5f5" }}
            />
          </Grid>

          <Grid item>
            {/* make a fancy file input button and take the file */}
            <input
              type="file"
              onChange={(e) => setUserImage(e.target.files[0])}
            />
            {/* put a text with ash back ground */}

            <Button variant="contained" color="primary">
              Upload Image
            </Button>
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
              onClick={editProfile}
            >
              Update Profile
            </Button>
          </Grid>
          <Grid item sm={5} />
        </Grid>
      </Grid>
    </div>
  );
};

export default EditProfile;
