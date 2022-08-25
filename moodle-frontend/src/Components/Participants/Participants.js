import { Grid, Typography, Card, CardContent } from "@mui/material";
import React, { useState, useEffect } from "react";
import useStyles from "./Style";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AuthContext } from "../Context/AuthContext";
import { useHttpClient } from "../Context/http-hook";

interface Column {
  id: "moodleID" | "userName" | "emailID" | "bioUser" | "roleUser";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "moodleID", label: "Moodle ID", minWidth: 170 },
  { id: "userName", label: "Name", minWidth: 100 },
  {
    id: "emailID",
    label: "Email",
    minWidth: 170,
    // align: "right",
    // format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "bioUser",
    label: "Bio",
    minWidth: 170,
    // align: "right",
    // format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "roleUser",
    label: "Role",
    minWidth: 170,
    // align: "right",
    // format: (value: number) => value.toFixed(2),
  },
];

function createData(
  moodleID: string,
  userName: string,
  emailID: string,
  bioUser: number,
  roleUser: number
): Data {
  // const density = population / size;
  return { moodleID, userName, emailID, bioUser, roleUser };
}

let participantList = [];

const Participants = (props) => {
  // destructuring props
  const { courseID, studentId } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourseParticipants, setLoadedCourseParticipants] =
    React.useState();
  const getToken = localStorage.getItem("token");

  let url = "http://localhost:5000/api/courses/" + courseID + "/users";

  useEffect(() => {
    const fetchCourseUsers = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        if (participantList.length === 0) {
          responseData.users.map((x) => {
            participantList.push(
              createData(
                x.moodleID ? x.moodleID : "",
                x.name ? x.name : "",
                x.email ? x.email : "",
                x.bio ? x.bio : "",
                x.role ? x.role : ""
              )
            );
          });
        }
        console.log(participantList);
        // console.log(responseData.users);
        setLoadedCourseParticipants(responseData.users);
      } catch (err) {}
    };
    fetchCourseUsers();
  }, [sendRequest, url, getToken]);

  return (
    <div>
      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  {" "}
                  Participants List
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
            {!isLoading && loadedCourseParticipants && (
              <TableBody>
                {participantList
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

export default Participants;
