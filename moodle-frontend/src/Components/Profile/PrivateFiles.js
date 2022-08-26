import { Grid, Typography, Card, CardContent } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "../Dashboard/Sidebar";

const newStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 900,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
  }),
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle,
  },
}));

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
  id: "file";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "file", label: "File", minWidth: 170 },
  // { id: "fileType", label: "File Type", minWidth: 100 },
];

function createData(file: string): Data {
  // const density = population / size;
  return { file };
}

let privateFileLists = [];

const PrivateFiles = (props) => {
  // destructuring props
  //   const { courseID, studentId } = props;

  const classes = useStyles();
  const newClasses = newStyles();
  const auth = useContext(AuthContext);
  const getToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const userID = localStorage.getItem("userId");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [userInfo, setUserInfo] = useState();
  const [userCourses, setUserCourses] = useState([]);
  const [userPrivateFiles, setUserPrivateFiles] = useState([]);
  const [component, setComponent] = useState(<div></div>);
  const [option, setOption] = useState("");

  const { assignmentId } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [loadedSubmissions, setLoadedSubmissions] = React.useState();

  useEffect(() => {
    // alert(localStorage.getItem("userId"));
    let url3 =
      "http://localhost:5000/api/users/get-all-private-files/" +
      localStorage.getItem("userId");
    // console.log(url3);
    const fetchUserFiles = async () => {
      try {
        const responseData = await sendRequest(url3, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        if (privateFileLists.length === 0) {
          responseData.privateFiles.map((x) => {
            privateFileLists.push(
              createData(x.file ? <a href={x.file}>{x.fileName}</a> : "No File")
            );
          });
          setUserPrivateFiles(privateFileLists);
        }
        console.log(responseData);
      } catch (err) {}
    };
    fetchUserFiles();
  }, [sendRequest]);

  useEffect(() => {
    if (option === "course") {
      navigate("/student/my-courses", {
        state: {
          courses: userCourses,
        },
      });
    } else if (option === "profile") {
      navigate("/student/profile", {});
    } else if (option === "edit-profile") {
      navigate("/student/edit-profile");
    } else if (option === "logout") {
      console.log("logout clicked");
      auth.logout();
      navigate("/");
    } else if (option === "private-files") {
      navigate("/student/private-files");
    } else if (option === "upload-private-files") {
      navigate("/student/upload-private-files");
    } else if (option === "notification") {
      navigate("/student/notifications");
    }
  }, [option, userCourses]);

  return (
    <div className={classes.root}>
      <Sidebar setOption={setOption} />
      <main className={classes.content}>
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    {" "}
                    Your Private Files
                  </TableCell>
                  {/* <TableCell align="center" colSpan={3}>
                    ------------------------------------------------------------
                  </TableCell> */}
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
              {!isLoading && userPrivateFiles && (
                <TableBody>
                  {privateFileLists
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
      </main>
    </div>
  );
};

export default PrivateFiles;
