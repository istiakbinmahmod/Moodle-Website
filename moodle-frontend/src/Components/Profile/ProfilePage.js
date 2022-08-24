import {
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
  Avatar,
} from "@mui/material";
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

const Profile = (props) => {
  const auth = useContext(AuthContext);
  const userID = localStorage.getItem("userId");
  console.log(userID);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [userInfo, setUserInfo] = useState();
  const [component, setComponent] = useState(<div></div>);

  useEffect(() => {
    const url =
      "http://localhost:5000/api/users/" + localStorage.getItem("userId");
    console.log(url);
    const fetchUserInfo = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + auth.token,
        });
        setUserInfo(responseData.user);
        console.log(responseData.user);
        setComponent(
          <div>
            {responseData.user.image}
            {responseData.user.name}
            {/* <Avatar alt={userInfo.image} src={userInfo.image} /> */}
          </div>
        );
      } catch (err) {}
    };
    fetchUserInfo();
  }, [sendRequest]);

  return <div>{component}</div>;
};

export default Profile;
