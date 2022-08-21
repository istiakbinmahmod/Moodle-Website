import { Grid, Typography, Card, CardContent } from "@mui/material";
import React, { useState, useEffect } from "react";
import useStyles from "../Scores/Style";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AuthContext } from "../Context/AuthContext";
import { useHttpClient } from "../Context/http-hook";
import { useParams } from "react-router-dom";
import Declarations from "./Declarations";

const columns: Column[] = [
  { id: "fName", label: "File Name", minWidth: 170 },
  { id: "file", label: "File", minWidth: 300 },
];

function createData(fName: string, file: string): Data {
  // const density = population / size;
  return { fName, file };
}

let rows = [];

const Materials = (props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { courseID } = props;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourseMaterials, setLoadedCourseMaterials] = React.useState();
  const getToken = localStorage.getItem("token");

  let url =
    "http://localhost:5000/api/students/get-course-materials/" + courseID;

  useEffect(() => {
    const fetchCourseMaterials = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        console.log(responseData);
        responseData.courseMaterials.map((x) => {
          rows.push(createData(x.title, x.file));
        });
        setLoadedCourseMaterials(responseData.courseMaterials);
      } catch (err) {}
    };
    fetchCourseMaterials();
  }, [sendRequest, url, getToken]);

  return (
    <>
      <div>
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    Course Materials
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
              {!isLoading && loadedCourseMaterials && (
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
      {/* <Declarations /> */}
    </>
  );
};

export default Materials;
