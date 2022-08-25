import { Grid, Typography, Card, CardContent } from "@mui/material";
import React, { useEffect, useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { AuthContext } from "../../Context/AuthContext";
import { useHttpClient } from "../../Context/http-hook";

import useStyles from "./StudentDashboardStyle";
import Card_ from "./CourseCard";
import ProfilePage from "../../Profile/ProfilePage";
import EditProfile from "../../Profile/EditProfile";
import CoursePanel from "../../CourseDetail/CoursePanel";
import { Logout } from "@mui/icons-material";

function Teams() {
  const classes = useStyles();

  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const getToken = localStorage.getItem("token");

  // fetch courses from server api
  const [courses, setCourses] = useState([]);
  const [component, setComponent] = useState(<div></div>);
  const [option, setOption] = useState("");

  let url =
    localStorage.getItem("userRole") === "student"
      ? "http://localhost:5000/api/students/get-my-courses"
      : "http://localhost:5000/api/teachers/get-my-courses";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setCourses(responseData.courses);
      } catch (err) {}
    };
    fetchCourses();
  }, [sendRequest, url]);

  useEffect(() => {
    if (option === "course") {
      navigate("/student/my-courses", {
        state: {
          courses: courses,
        },
        // replace: true,
      });
    } else if (option === "profile") {
      navigate("/student/profile", {});
      // console.log("profile clicked");
      // setComponent(
      //   <div>
      //     <Typography> Profile </Typography>
      //     <ProfilePage key="profile" />
      //   </div>
      // );
    } else if (option === "edit-profile") {
      navigate("/student/edit-profile");
      // setComponent(
      //   <div>
      //     <Typography> Edit Profile </Typography>
      //     <EditProfile key="profile" />
      //   </div>
      // );
    } else if (option === "logout") {
      console.log("logout clicked");
      auth.logout();
      navigate("/");
    }
  }, [option, courses]);

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
                <Card_ course={course} key={course._id} />
              </Grid>
            ))}
          </Grid>
        </div>
      </main>
    </div>
  );
}

export default Teams;
