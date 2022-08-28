import {
  Grid,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
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
import { useNavigate } from "react-router-dom";

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
  id: "file" | "moodleID" | "uploadedAt";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "file", label: "File", minWidth: 170 },
  { id: "moodleID", label: "Moodle ID", minWidth: 100 },
  {
    id: "uploadedAt",
    label: "Upload Time",
    minWidth: 170,
    // align: "right",
    // format: (value: number) => value.toLocaleString("en-US"),
  },
];

function createData(file: string, moodleID: string, uploadedAt: Date): Data {
  // const density = population / size;
  return { file, moodleID, uploadedAt };
}

let submissionLists = [];

const AllSubmissions = (props) => {
  // destructuring props
  //   const { courseID, studentId } = props;
  const navigate = useNavigate();
  const courseID = props.courseID;
  const courseTitle = props.courseTitle;
  const assignmentId = props.assignmentId;
  // const { courseID, courseTitle, assignmentId } = props;
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const getToken = localStorage.getItem("token");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [loadedSubmissions, setLoadedSubmissions] = React.useState();

  let url =
    "http://localhost:5000/api/teachers/get-all-submissions/" + assignmentId;

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        if (submissionLists.length === 0) {
          responseData.submissions.map((x) => {
            submissionLists.push(
              createData(
                x.file ? (
                  <a href={x.file} download>
                    {x.filename}
                  </a>
                ) : (
                  ""
                ),
                x.moodleID ? x.moodleID : "",
                formatDate(x.uploaded_at) ? formatDate(x.uploaded_at) : ""
              )
            );
          });
        }
        console.log(responseData.submissions);
        setLoadedSubmissions(responseData.submissions);
      } catch (err) {}
    };
    fetchSubmissions();
  }, [sendRequest, url, getToken]);

  return (
    <div>
      <List>
        <ListItemButton
          key={1}
          onClick={() => {
            navigate(
              "/teacher/my/course/" +
                courseTitle +
                "/" +
                courseID +
                "/edit/assignments/" +
                assignmentId,
              {
                state: {
                  courseID: courseID,
                  courseTitle: courseTitle,
                  assignmentID: assignmentId,
                },
              }
            );
          }}
        >
          Edit Assignment
        </ListItemButton>
      </List>
      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  {" "}
                  Submissions List
                </TableCell>
                <TableCell align="center" colSpan={3}>
                  Information
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
            {!isLoading && loadedSubmissions && (
              <TableBody>
                {submissionLists
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
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
    </div>
  );
};

export default AllSubmissions;
