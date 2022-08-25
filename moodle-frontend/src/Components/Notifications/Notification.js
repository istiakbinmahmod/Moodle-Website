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

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { Person } from "@mui/icons-material";
import Divider from "@material-ui/core/Divider";

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

interface Column {
  id: "notification" | "time";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "notification", label: "Notifications", minWidth: 170 },
  { id: "time", label: "Time", minWidth: 170 },
];

function createData(notification: string, time: string): Data {
  // const density = population / size;
  return { notification, time };
}

let rows = [];

const Notifications = () => {
  const classes = useStyles();
  const newClasses = newStyles();
  const auth = useContext(AuthContext);
  const getToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const userID = localStorage.getItem("userId");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [userInfo, setUserInfo] = useState();
  const [userCourses, setUserCourses] = useState([]);
  const [component, setComponent] = useState(<div></div>);
  const [option, setOption] = useState("");

  // destructuring props
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [loadedNotifications, setLoadedNotifications] = React.useState();

  useEffect(() => {
    let url =
      "http://localhost:5000/api/users/" + localStorage.getItem("userId");
    const fetchUserInfo = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setUserInfo(responseData.user);
      } catch (err) {}
    };
    fetchUserInfo();
  }, [sendRequest]);

  useEffect(() => {
    const url =
      localStorage.getItem("userRole") === "student"
        ? "http://localhost:5000/api/students/get-my-courses"
        : "http://localhost:5000/api/teachers/get-my-courses";
    const fetchUserCourses = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setUserCourses(responseData.courses);
      } catch (err) {}
    };
    fetchUserCourses();
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

  useEffect(() => {
    let url =
      "http://localhost:5000/api/users/get-notifications/" +
      localStorage.getItem("userId");
    const fetchNotifications = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        {
          rows.length === 0 &&
            responseData.notifications.map((x) => {
              rows.push(
                createData(
                  x.title,
                  x.date
                  // ? x.title : ""
                )
              );
            });
        }
        // });
        console.log("rows hocche ", rows);
        // console.log(responseData.users);
        console.log(responseData.notifications);
        setLoadedNotifications(responseData.notifications);
      } catch (err) {}
    };
    fetchNotifications();
  }, [sendRequest, getToken]);

  return (
    <div className={classes.root}>
      <Sidebar setOption={setOption} />
      <main className={classes.content}>
        <Paper sx={{ width: "110%" }}>
          <TableContainer /*sx={{ maxHeight: 440 }}*/>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    Notifications List
                  </TableCell>
                  <TableCell align="center" colSpan={3}>
                    " "
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
              {!isLoading && loadedNotifications && (
                <TableBody>
                  {rows
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

export default Notifications;
