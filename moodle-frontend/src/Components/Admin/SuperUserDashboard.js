import { Grid, Typography } from "@mui/material";
import React from "react";

import useStyles from "../Dashboard/StudentDashboard/StudentDashboardStyle";
import { useState, useEffect } from "react";
import SideDrawer from "./SideDrawer";
import Approve from "./Approve";

import AssignCourseTeachers from "./AssignCourseTeachers";
import AssignCourseStudents from "./AssignCourseStudents";
import CreateCourse from "./CreateCourse";
import DeleteCourse from "./DeleteCourse";
import CreateSession from "./CreateSession";
import CreateStudent from "./CreateStudent";
import CreateTeacher from "./CreateTeacher";

const Dashboard = () => {
  const classes = useStyles();
  const [component, setComponent] = useState(<div></div>);
  const [option, setOption] = useState("post");

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
    }

    // else if (option === 'announcement'){
    else if (option === "approve") {
      setComponent(
        <div>
          <Approve />
        </div>
      );
    } else if (option === "overview") {
      setComponent(
        <div>
          <h1>overview</h1>
        </div>
      );
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
