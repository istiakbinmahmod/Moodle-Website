import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Button,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

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
import clsx from "clsx";

import {
  // Card,
  CardHeader,
  // CardContent,
  CardActions,
  Collapse,
  IconButton,
  // Typography,
} from "@material-ui/core";
import { Input } from "@material-ui/core";

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

const newStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    backgroundColor: "#181818",
    color: "white",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
}));

const SpecificForumPostReply = (props) => {
  const [expanded, setExpanded] = React.useState(true);

  // destructuring props
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const getToken = localStorage.getItem("token");
  const { specificPostReply } = props;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPost, setLoadedPost] = useState();
  const [postId, setPostId] = useState();
  const [component, setComponent] = useState();
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    const url =
      "http://localhost:5000/api/users/get-a-reply/" + specificPostReply;
    const fetchReply = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedPost(responseData.post);
      } catch (err) {}
    };
    fetchReply();
  }, [sendRequest, getToken]);

  return (
    <div>
      {!isLoading && loadedPost && (
        <>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <CardActionArea>
                <Card
                  style={{
                    minWidth: 275,
                    height: "80%",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  {/* <Card sx={{ minWidth: 275 }}> */}
                  <CardContent>
                    <Typography
                      variant="h5"
                      sx={{ fontSize: 21 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Post Title : {loadedPost.title}
                    </Typography>

                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Created By : {loadedPost.author}
                    </Typography>
                    {/* make it bold */}
                    <Typography
                      variant="h5"
                      sx={{ mb: 1.5, font: "caption" }}
                      color="text.secondary"
                    >
                      Date : {formatDate(loadedPost.postDate)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </CardActionArea>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

export default SpecificForumPostReply;
