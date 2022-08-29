import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Button,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { Link, navigate, useNavigate } from "react-router-dom";

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
import SpecificForumPostReply from "./SpecificFormPostReply";
import { Navigate } from "react-router-dom";

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
  // var date = n + ", " + mon + +day + ", " + year + " at " + h + ":" + m;
  return strTime;
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

const SpecificForumPost = (props) => {
  const [expanded, setExpanded] = React.useState(true);

  // destructuring props
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const getToken = localStorage.getItem("token");
  const { courseID, courseTitle, specificPost } = props;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPost, setLoadedPost] = useState();
  const [loadedPostReplies, setLoadedPostReplies] = useState();
  const [postId, setPostId] = useState();
  const [component, setComponent] = useState();
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    const url =
      "http://localhost:5000/api/users/get-all-replies/" + specificPost;
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedPost(responseData.post);
        setLoadedPostReplies(responseData.replies);
        console.log(responseData.post);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, getToken]);

  const typeComment = (e) => {
    setCommentInput(e.target.value);
  };

  const addComment = async (e) => {
    // console.log(loadedPost.replies);
    const url =
      "http://localhost:5000/api/users/reply/" +
      specificPost +
      "/" +
      localStorage.getItem("userId");
    try {
      await sendRequest(
        url,
        "POST",
        JSON.stringify({ replyDescription: commentInput }),
        {
          Authorization: "Bearer " + getToken,
          "Content-Type": "application/json",
        }
      );
      setCommentInput("");
      // alert("reply sent");
      // navigate(
      //   localStorage.getItem("userRole") === "student"
      //     ? "/student/my/course/" + courseTitle + "/" + courseID + "/forum"
      //     : "/teacher/my/course/" + courseTitle + "/" + courseID + "/forum",
      //   {
      //     state: {
      //       courseID: courseID,
      //       courseTitle: courseTitle,
      //     },
      //   }
      // );
      window.location.reload();
    } catch (err) {}
  };

  return (
    <div>
      {!isLoading && loadedPost && (
        <>
          {/* <Card className={classes.root}>
            <CardHeader
              className="text-center"
              title={"Post Title : " + loadedPost.title}
            />
          </Card> */}
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <CardActionArea
              // onClick={(e) => {
              //   setSpecificPostId(post._id);
              // }}
              >
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
                      style={{ fontWeight: 600 }}
                    >
                      {loadedPost.title}
                    </Typography>

                    <Typography
                      sx={{ mb: 1.5, fontSize: 13 }}
                      color="text.secondary"
                      style={{ color: "blue" }}
                    >
                      By : {loadedPost.author} <br />
                      Date : {formatDate(loadedPost.postDate)}
                    </Typography>
                    {/* make it bold */}

                    <Typography>{loadedPost.postDescription}</Typography>
                    {/* <Typography
                      variant="h5"
                      sx={{ mb: 1.5, font: "caption", fontSize: 10 }}
                      color="text.secondary"
                    >
                      
                    </Typography> */}
                  </CardContent>
                  {/* <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions> */}
                </Card>
              </CardActionArea>
            </Grid>
          </Grid>
        </>
      )}
      {
        !isLoading &&
          loadedPostReplies &&
          // (
          //   <div>
          // {
          loadedPostReplies.map((rep) => (
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
                        sx={{ fontSize: 16 }}
                        color="text.secondary"
                        gutterBottom
                        style={{ fontWeight: 600 }}
                      >
                        Re : {loadedPost.title}
                      </Typography>

                      <Typography
                        variant="h7"
                        sx={{ mb: 1.5 }}
                        color="text.secondary"
                        style={{ color: "blue" }}
                      >
                        By : {rep.replier} Date : {formatDate(rep.replyDate)}
                      </Typography>
                      {/* make it bold */}
                      <Typography sx={{ mb: 1.5, mt: 1.5 }}>
                        {rep.replyDescription}
                      </Typography>
                    </CardContent>
                  </Card>
                </CardActionArea>
              </Grid>
            </Grid>
          ))
        // )
      }
      <CardContent>
        <div>
          <Input
            value={commentInput}
            // disabled="false"
            multiline
            rowsMin="1"
            maxRows="3"
            placeholder="Type your reply ..."
            // placeholder={
            //   // isLogged ? "Login to comment" :
            //   "Type your comment..."
            // }
            style={{ width: "100%", color: "black" }}
            onChange={typeComment}
          />
          <Button
            size="small"
            // disabled={!isLogged}
            color="primary"
            variant="contained"
            style={{
              backgroundColor: "#0000ff",
              marginTop: "1%",
              color: "white",
            }}
            onClick={addComment}
          >
            Reply
          </Button>
        </div>
      </CardContent>
      {/* // </div>/ */}
      {/* // ) */}
      {/* // } */}
    </div>
  );
};

export default SpecificForumPost;
