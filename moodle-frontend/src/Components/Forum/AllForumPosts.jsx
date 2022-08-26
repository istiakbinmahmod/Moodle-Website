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
import SpecificForumPost from "./SpecificForumPost";
import SubmissionPanel from "../Submission/Submission";
import { Navigate } from "react-router-dom";
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


const AllForumPosts = (props) => {
  // destructuring props
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const getToken = localStorage.getItem("token");
  const { courseID } = props;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedForumPosts, setLoadedForumPosts] = useState();
  const [specificPostId, setSpecificPostId] = useState();
  const [postId, setPostId] = useState();
  const [component, setComponent] = useState(<div></div>);
  const [redir, setRedir] = useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleClick = (event) => {
    alert("this works");
  };
  

  useEffect(() => {
    const url = "http://localhost:5000/api/users/get-all-posts/" + courseID;
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        if (forumPostsList.length === 0) {
          responseData.posts.map((x) =>
            forumPostsList.push(
              createData(
                x.title ? (
                  <span>{x.title}</span>
                  // <button onClick={(e) => {
                  //   setSpecificPostId(x._id);
                  //   alert(x._id);
                  //   // setComponent(<SpecificForumPost postId={x.id} />);
                  // }} >{x.title}</button>
                  // <span
                    // onClick={this.handleClick}
                    // {(e) => {
                      //   setComponent(
                      //     <SpecificForumPost specificPostId={x._id} />
                      //   );
                      //   alert(x._id);
                      //   Navigate("/");
                      //   alert(redir);
                      // setRedir(true);
                      //   alert(redir);
                      //   alert(x._id);
                      //   alert("reaching");
                      // setSpecificPostId(x._id);
                      //   alert("reaching2");
                      //   alert(component);
                      //   shiftToPost(x._id);
                    // }}
                    // onclick="alert('hey there')"
                    // style={{ color: "blue", cursor: "pointer" }}
                  // >
                    // {x.title}
                  // </span>e
                ) : (
                  //   <a href="#" style={{ textDecoration: "none" }}>
                  //     {x.title}
                  //   </a>
                  ""
                ),
                x.author ? x.author : "",
                formatDate(x.postDate) ? formatDate(x.postDate) : ""
              )
            )
          );
        }
        setLoadedForumPosts(responseData.posts);
        setComponent(
          <div>
            <Paper sx={{ width: "100%" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" colSpan={2}>
                        {" "}
                        All Forum Posts
                      </TableCell>
                      <TableCell align="center" colSpan={3}>
                        {/* Information */}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ top: 57, minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  {/* {!isLoading && loadedForumPosts && ( */}
                  <TableBody>
                    {forumPostsList
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        console.log(row.author);
                        return (

                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.code}
                            // onClick={(e) => {
                            //   setSpecificPostId(row.code);
                            // }}
                          >
                            {/* <CardActionArea
                            onClick={(e) => {
                              alert(row.code);
                              // setSpecificPostId(row.code);
                            }}
                            >
                            <Card
                                  style={{
                                    minWidth: 275,
                                    height: "80%",
                                    //   backgroundColor: "#f5f5f5",
                                  }}
                                >
                                  <CardContent> */}
                            {columns.map((column) => {
                              const value = row[column.id];
                              // alert(value);
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}
                            {/* </CardContent>
                                </Card>
                            </CardActionArea> */}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                  {/* )} */}
                </Table>
              </TableContainer>
            </Paper>
          </div>
        );
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, getToken]);

  //   useEffect(() => {
  //     if (specificPost)
  //       setComponent(
  //         <SubmissionPanel assignmentId={specificPost} courseId={courseID} />
  //         // assignmentId={selectedAssId} studentId={studentId}
  //         //  />
  //       );
  //   }, [specificPost]);

  useEffect(() => {
    // if (redir) {
      setComponent(<SpecificForumPost specificPost={specificPostId} />);
      // alert("reaching");
    // }
    // <SubmissionPanel assignmentId={selectedAssId} studentId={studentId} />
  }, [ specificPostId]);

  //   useEffect(() => {
  //     const fetchCourseUsers = async () => {
  //       try {
  //         const responseData = await sendRequest(url, "GET", null, {
  //           Authorization: "Bearer " + getToken,
  //         });
  //         if (participantList.length === 0) {
  //           responseData.users.map((x) => {
  //             participantList.push(
  //               createData(
  //                 x.moodleID ? x.moodleID : "",
  //                 x.name ? x.name : "",
  //                 x.email ? x.email : "",
  //                 x.bio ? x.bio : "",
  //                 x.role ? x.role : ""
  //               )
  //             );
  //           });
  //         }
  //         console.log(participantList);
  //         // console.log(responseData.users);
  //         setLoadedCourseParticipants(responseData.users);
  //       } catch (err) {}
  //     };
  //     fetchCourseUsers();
  //   }, [sendRequest, url, getToken]);

  return <div>{component}</div>;
};

export default AllForumPosts;

{
  /* <div>
  <Paper sx={{ width: "100%" }}>
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={2}>
              {" "}
              All Forum Posts
            </TableCell>
            <TableCell align="center" colSpan={3}></TableCell>
          </TableRow>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ top: 57, minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        {!isLoading && loadedForumPosts && (
          <TableBody>
            {forumPostsList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  </Paper>
</div>; */
}
