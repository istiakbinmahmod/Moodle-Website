import { Grid, Typography, Card, CardContent } from "@mui/material";
import { React, useState, useEffect, useContext } from "react";
import Card_ from "./CourseCard";
import Sidebar from "../Dashboard/Sidebar";
import { AuthContext } from "../Context/AuthContext";
import { useHttpClient } from "../Context/http-hook";
import CourseDetail from "./Course";
import { useLocation } from "react-router-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useStyles from "../Dashboard/StudentDashboard/StudentDashboardStyle";

const CoursePanel = () => {
  const classes = useStyles();

  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const getToken = localStorage.getItem("token");

  const { state } = useLocation();
  const courses = state.courses;
  const [option, setOption] = useState();
  const [courseID, setCourseID] = useState();
  const [courseTitle, setCourseTitle] = useState();

  useEffect(() => {
    if (option === "course") {
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/my-courses"
          : "/teacher/my-courses",
        {
          state: {
            courses: courses,
          },
        }
      );
    } else if (option === "profile") {
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/profile"
          : "/teacher/profile",
        {}
      );
    } else if (option === "edit-profile") {
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/edit-profile"
          : "/teacher/edit-profile"
      );
    } else if (option === "private-files") {
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/private-files"
          : "/teacher/private-files"
      );
    } else if (option === "logout") {
      auth.logout();
      navigate("/");
    } else if (option === "upload-private-files") {
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/upload-private-files"
          : "/teacher/upload-private-files"
      );
    } else if (option === "notification") {
      navigate(
        localStorage.getItem("student")
          ? "/student/notifications"
          : "/teacher/notifications"
      );
    }
  }, [option, courses]);

  useEffect(() => {
    // alert("lol");
    if (courseTitle) {
      // alert(localStorage.getItem("userRole"));
      localStorage.getItem("userRole") === "student"
        ? navigate(`/student/my/course/${courseTitle}/${courseID}`, {
            state: {
              courseID: courseID,
              courseTitle: courseTitle,
            },
          })
        : navigate(`/teacher/my/course/${courseTitle}/${courseID}`, {
            state: {
              courseID: courseID,
              courseTitle: courseTitle,
            },
          });
    }
  }, [courseTitle]);

  return (
    <div className={classes.root}>
      <Sidebar setOption={setOption} />
      <main className={classes.content}>
        <div>
          <Typography>Your Courses</Typography>
          <Grid container>
            {/* return a card for every course in courses */}
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4}>
                <Card_
                  course={course}
                  key={course._id}
                  setCourseID={setCourseID}
                  setCourseTitle={setCourseTitle}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </main>
    </div>
  );
  // <div>{component ? component : <div>Loading .... </div>}</div>;
};

export default CoursePanel;
