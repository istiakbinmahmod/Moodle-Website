import { Grid, Typography } from "@mui/material";
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import useStyles from "../Dashboard/StudentDashboard/StudentDashboardStyle";
import { useState, useEffect } from "react";
import SideDrawer from "./SideDrawer";

import AssignCourseTeachers from "./AssignCourseTeachers";
import AssignCourseStudents from "./AssignCourseStudents";
import AssignMultipleCourseStudents from "./AssignMultipleCourseStudents";
import CreateCourse from "./CreateCourse";
import DeleteCourse from "./DeleteCourse";
import CreateSession from "./CreateSession";
import CreateStudent from "./CreateStudent";
import CreateTeacher from "./CreateTeacher";
import CourseParticipants from "./CourseParticipantsList";
import DeleteParticipants from "./DeleteParticipants";
import CreateStudents from "./CreateStudents";

const Dashboard = () => {
  const classes = useStyles();
  const [component, setComponent] = useState(<div></div>);
  const [option, setOption] = useState("post");
  const navigate = useNavigate();

  useEffect(() => {
    if (option === "assign-teacher") {
      setComponent(
        <div>
          <AssignCourseTeachers />
        </div>
      );
    } else if (option === "assign-student") {
      setComponent(
        <div>
          <AssignCourseStudents />
        </div>
      );
    } else if (option === "assign-multiple-student") {
      setComponent(
        <div>
          <AssignMultipleCourseStudents />
        </div>
      );
    } else if (option === "show-participants") {
      setComponent(
        <div>
          <CourseParticipants />
        </div>
      );
    } else if (option === "create-course") {
      setComponent(
        <div>
          <CreateCourse />
        </div>
      );
    } else if (option === "delete-course") {
      setComponent(
        <div>
          <DeleteCourse />
        </div>
      );
    } else if (option === "create-session") {
      setComponent(
        <div>
          <CreateSession />
        </div>
      );
    } else if (option === "create-teacher") {
      setComponent(
        <div>
          <CreateTeacher />
        </div>
      );
    } else if (option === "create-student") {
      setComponent(
        <div>
          <CreateStudent />
        </div>
      );
    } else if (option === "create-batch") {
      setComponent(
        <div>
          <CreateStudents />
        </div>
      );
    } else if (option === "remove-user") {
      setComponent(
        <div>
          <DeleteParticipants />
        </div>
      );
    } else if (option === "logout") {
      navigate("/");
      // setComponent(
      //   <div>
      //     <h1>overview</h1>
      //   </div>
      // );
    }
  }, [option]);

  return (
    <div className={classes.root}>
      <SideDrawer setOption={setOption} />
      <main className={classes.content}>{component}</main>
    </div>
  );
};

export default Dashboard;
