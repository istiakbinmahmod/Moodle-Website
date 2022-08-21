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

let rows = [];
// const rows = [
//   createData("India", "IN", 1324171354, 3287263),
//   createData("China", "CN", 1403500365, 9596961),
//   createData("Italy", "IT", 60483973, 301340),
//   createData("United States", "US", 327167434, 9833520),
//   createData("Canada", "CA", 37602103, 9984670),
//   createData("Australia", "AU", 25475400, 7692024),
//   createData("Germany", "DE", 83019200, 357578),
//   createData("Ireland", "IE", 4857000, 70273),
//   createData("Mexico", "MX", 126577691, 1972550),
//   createData("Japan", "JP", 126317000, 377973),
//   createData("France", "FR", 67022000, 640679),
//   createData("United Kingdom", "GB", 67545757, 242495),
//   createData("Russia", "RU", 146793744, 17098246),
//   createData("Nigeria", "NG", 200962417, 923768),
//   createData("Brazil", "BR", 210147125, 8515767),
// ];

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
        responseData.users.map((x) => {
          rows.push(createData(x.moodleID, x.name, x.email, x.bio, x.role));
        });
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
                  Name
                </TableCell>
                <TableCell align="center" colSpan={3}>
                  Details
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
    </div>
  );
};

export default Participants;
