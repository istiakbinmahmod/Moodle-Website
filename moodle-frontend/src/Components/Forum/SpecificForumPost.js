import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Button,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import useStyles from "../Participants/Style";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AuthContext } from "../Context/AuthContext";
import { useHttpClient } from "../Context/http-hook";

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
  var date = n + ", " + mon + +day + ", " + year + " at " + h + ":" + m;
  return date;
};

interface Column {
  id: "title" | "author" | "postDate";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "title", label: "Discussion", minWidth: 170 },
  { id: "author", label: "Started By", minWidth: 100 },
  {
    id: "postDate",
    label: "First Post",
    minWidth: 170,
    // align: "right",
    // format: (value: number) => value.toLocaleString("en-US"),
  },
];

function createData(title: string, author: string, postDate: Date): Data {
  // const density = population / size;
  return { title, author, postDate };
}

let forumPostsList = [];

const SpecificForumPost = (props) => {
  // destructuring props
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const getToken = localStorage.getItem("token");
  const { specificPostId } = props;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedForumPosts, setLoadedForumPosts] = useState();
  const [specificPost, setSpecificPost] = useState();
  const [postId, setPostId] = useState();
  const [component, setComponent] = useState();

  return (
    <div>lol</div>
    // <Grid Container direction="column">
    //   <Grid item>
    //     <Paper
    //       sx={{
    //         backgroundColor: "#D6D7D7",
    //         paddingTop: "30px",
    //         paddingBottom: "30px",
    //       }}
    //     >
    //       <center>
    //         <Typography variant="h5">Forum Post</Typography>
    //       </center>
    //     </Paper>
    //   </Grid>
    // </Grid>
  );
};

export default SpecificForumPost;
