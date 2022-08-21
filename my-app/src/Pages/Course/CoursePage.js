import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
// import auth from './../auth/auth-helper'
// import {listByInstructor} from './api-course.js'
import { Redirect, Link, useParams } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useHttpClient } from "../../Hooks/http-hook";
import Rest__img from "../../img/restaurant.jpg";
import RestCard from "../../Components/RestCard/RestCard";
import { FaArrowRight } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Course.css";
import logo from "../../img/Moodle-Logo.wine.png";
import fileLogo from "../../img/pdf-24.png";

// let courseName;

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(12),
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(
      1
    )}px`,
    color: theme.palette.protectedTitle,
    fontSize: "1.2em",
  },
  addButton: {
    float: "right",
  },
  leftIcon: {
    marginRight: "8px",
  },
  avatar: {
    borderRadius: 0,
    width: 65,
    height: 40,
  },
  listText: {
    marginLeft: 16,
  },
  marginTop: {},
}));

export default function CoursePage() {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const courseID = useParams().courseID;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourse, setLoadedCourse] = useState();
  const [loadedCourseMaterials, setLoadedCourseMaterials] = useState();
  const [loadedCourseAssignments, setLoadedCourseAssignments] = useState();

  const navigate = useNavigate();
  // const getToken = auth.token;
  const getToken = localStorage.getItem("token");

  let url = "http://localhost:5000/api/courses/" + courseID;
  let url2 =
    localStorage.getItem("userRole") === "student"
      ? "http://localhost:5000/api/students/get-course-materials/" + courseID
      : "http://localhost:5000/api/teachers/get-materials/" + courseID;
  let url3;
  {
    localStorage.getItem("userRole") === "student"
      ? (url3 =
          "http://localhost:5000/api/students/get-all-course-assignments/" +
          courseID)
      : (url3 =
          "http://localhost:5000/api/teachers/get-all-course-assignment/" +
          courseID);
  }

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        //   console.log(url);
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedCourse(responseData.course);
        console.log(responseData);
      } catch (err) {}
    };
    fetchCourse();
  }, [sendRequest, url]);

  useEffect(() => {
    const fetchCourseMaterials = async () => {
      try {
        //   console.log(url);
        const responseData = await sendRequest(url2, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedCourseMaterials(responseData.courseMaterials);
        console.log("istsiak", responseData.courseMaterials);
      } catch (err) {}
    };
    fetchCourseMaterials();
  }, [sendRequest, url2, auth.token]);

  useEffect(() => {
    const fetchCourseAssignments = async () => {
      try {
        //   console.log(url);
        const responseData = await sendRequest(url3, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedCourseAssignments(responseData.courseAssignments);
        //   console.log(responseData);
      } catch (err) {}
    };
    fetchCourseAssignments();
  }, [sendRequest, url3]);

  return (
    <body class="d-flex flex-column justify-content-center">
      <section class="d-flex flex-column justify-content-between">
        <div
          class="text-end text-sm-start text-lg-end d-flex flex-column justify-content-between"
          id="coursepage"
        >
          {!isLoading && loadedCourse && (
            <p id="p1">My Courses &gt; {loadedCourse.courseID}</p>
          )}
          <div class="container" id="ccon">
            {!isLoading && loadedCourse && (
              <h1 class="display-5 fw-bold" id="chead">
                {loadedCourse.courseID} : {loadedCourse.courseTitle}
              </h1>
            )}
            <nav className="navbar navbar-light navbar-expand-md">
              <div className="container-fluid">
                <button
                  data-bs-toggle="collapse"
                  className="navbar-toggler"
                  data-bs-target="#navcol-1"
                >
                  <span className="visually-hidden">Toggle navigation</span>
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navcol-1">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <a className="nav-link active" href="#">
                        Course
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        Setting
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        Participants
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        Grades
                      </a>
                    </li>
                    <li className="nav-item">
                      <Link to={"/my/forum/" + courseID}>
                        <p className="nav-link" href="#">
                          Forum
                        </p>
                      </Link>
                      {/* <a className="nav-link" href="#">
                        Forum
                      </a> */}
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
            <div id="cdiv">
              <p id="cp">Resources</p>
              {!isLoading &&
                loadedCourseMaterials &&
                loadedCourseMaterials.map((cmat) => (
                  <p id="cp2">
                    {/* {cmat.file} */}
                    {/* <img src={fileLogo} /> */}
                    {/* <p>Rana</p> */}
                    <a href={cmat.file} style={{ textDecoration: "none" }}>
                      {cmat.title}
                      {/* {cmat.file} */}
                    </a>
                  </p>
                ))}
              <p id="cp3">Assesments</p>
              {!isLoading &&
                loadedCourseAssignments &&
                loadedCourseAssignments.map((cass) => (
                  <p id="cp2">
                    {/* <img src={fileLogo} /> */}
                    <a
                      href={cass.file}
                      style={{ textDecoration: "none" }}
                      download
                    >
                      {cass.title}
                    </a>
                    <br></br>
                    <Link
                      to={"/my/course/submission/" + courseID + "/" + cass._id}
                      style={{ textDecoration: "none" }}
                    >
                      Submit
                    </Link>
                  </p>
                ))}
              {/* {localStorage.getItem("userRole") === "teacher" && (
                <p id="ctp3">
                  <i className="fas fa-plus-square" id="cti"></i>&nbsp;Add
                  Resources
                </p>
              )} */}
              {/* <p id="cp2">
                <img src="../../img/icon%20(3).svg" />
                Project Preliminary Presentation(A2)
              </p>
              <p id="cp2">
                <img src="../../img/icon%20(3).svg" />
                Project Preliminary Presentation(B2)
              </p> */}
            </div>
          </div>
        </div>
      </section>
      {/* <script src="../../bootstrap/js/bootstrap.min.js"></script> */}
    </body>
  );
}
