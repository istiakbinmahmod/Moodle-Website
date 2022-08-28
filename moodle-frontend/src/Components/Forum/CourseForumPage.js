import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Button,
} from "@mui/material";
import Box from "@mui/material/Box";
import {
  // CardActionArea,
  // Grid,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import CardActions from "@mui/material/CardActions";
import { Assessment, ThumbUp } from "@mui/icons-material";

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
import SpecificForumPost from "./SpecificForumPost";
import SubmissionPanel from "../Submission/Submission";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
  var date = n + ", " + mon + " " + day + ", " + year + " at " + h + ":" + m;
  // var date = date.toLocalDateString("en-US");
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

const CourseForumPage = (props) => {
  // destructuring props
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const getToken = localStorage.getItem("token");
  const { courseID, courseTitle } = props;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedForumPosts, setLoadedForumPosts] = useState([]);
  const [specificPostId, setSpecificPostId] = useState();
  const [postId, setPostId] = useState();
  const [component, setComponent] = useState(<div></div>);
  const [redir, setRedir] = useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    const url = "http://localhost:5000/api/users/get-all-posts/" + courseID;
    // console.log(url);
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedForumPosts(responseData.posts);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, getToken]);

  // useEffect(() => {
  //   if (specificPostId) {
  //     setComponent(<SpecificForumPost specificPost={specificPostId} />);
  //     // alert("reaching");
  //   }
  //   // <SubmissionPanel assignmentId={selectedAssId} studentId={studentId} />
  // }, [specificPostId]);

  return (
    <div>
      {loadedForumPosts &&
        loadedForumPosts.map((post) => (
          <Grid item xs={12}>
            <CardActionArea
              onClick={(e) => {
                // setSpecificPostId(post._id);
                navigate(
                  localStorage.getItem("userRole") === "student"
                    ? "/student/my/course/" +
                        courseTitle +
                        "/" +
                        courseID +
                        "/forum/post/" +
                        post._id
                    : "/teacher/my/course/" +
                        courseTitle +
                        "/" +
                        courseID +
                        "/forum/post/" +
                        post._id,
                  {
                    state: {
                      courseID: courseID,
                      courseTitle: courseTitle,
                      postID: post._id,
                    },
                  }
                );
              }}
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
                  >
                    Post Title : {post.title}
                  </Typography>

                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Created By : {post.author}
                  </Typography>
                  {/* make it bold */}
                  <Typography
                    variant="h5"
                    sx={{ mb: 1.5, font: "caption" }}
                    color="text.secondary"
                  >
                    Date : {formatDate(post.postDate)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </CardActionArea>
          </Grid>
        ))}
    </div>
  );
};

export default CourseForumPage;
