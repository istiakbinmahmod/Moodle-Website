import { Grid, Typography, Card, CardContent } from "@mui/material";
import React, { useEffect, useContext, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import SideAssignment from "./SideAssignment";
import useStyles from "../CourseDetail/GradeStyle";
import Paper from "@mui/material/Paper";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Divider } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
//  folder icon
import FolderIcon from "@mui/icons-material/Folder";
// grade icon
import GradeIcon from "@mui/icons-material/Grade";
// import useStyles from "../Dashboard/StudentDashboardStyle";
// import Card_ from "./CourseCard";
// import EditProfile from "../../Profile/EditProfile";
import { Logout } from "@mui/icons-material";
import DueAssignment from "./Due";
import AssignmentSubmit from "./AssignmentSubmit";
import { AuthContext } from "../../Components/Context/AuthContext";
import { useHttpClient } from "../../Components/Context/http-hook";

const AllAssignments = (props) => {
  const classes = useStyles();
  const { courseTitle, courseID, studentId } = props;
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const getToken = localStorage.getItem("token");

  // fetch courses from server api
  const [courses, setCourses] = useState([]);
  const [loadedCourseAssignments, setLoadedCourseAssignments] = useState();
  const [component, setComponent] = useState(<div></div>);
  const [option, setOption] = useState("assignment");

  let url2 = "http://localhost:5000/api/students/get-all-course-assignments/";

  useEffect(() => {
    const fetchCourseAssignments = async () => {
      try {
        const responseData = await sendRequest(url2, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedCourseAssignments(responseData.courseAssignments);
      } catch (err) {}
    };
    fetchCourseAssignments();
    // });
  }, [sendRequest, url2, getToken]);

  // const handleClick = (courseId) => {

  useEffect(() => {
    if (option === "assignment") {
      setComponent(
        <div>
          <Typography>Your Due Assignments</Typography>
          <DueAssignment />
        </div>
      );
    } else if (option === "submit") {
      setComponent(
        <div>
          <Typography>Submit Assignment</Typography>
          <AssignmentSubmit />
        </div>
      );
    }
  }, [option, loadedCourseAssignments]);

  return (
    <div className={classes.root}>
      <SideAssignment setOption={setOption} />
      <main className={classes.content}>{component}</main>
    </div>
  );
};

export default AllAssignments;
