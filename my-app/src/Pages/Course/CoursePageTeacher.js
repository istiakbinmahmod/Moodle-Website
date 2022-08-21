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
import { Redirect, Link, useParams } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useHttpClient } from "../../Hooks/http-hook";
import Rest__img from "../../img/restaurant.jpg";
import RestCard from "../../Components/RestCard/RestCard";
import { FaArrowRight } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CourseTeacher.css";
import logo from "../../img/Moodle-Logo.wine.png";
import fileLogo from "../../img/pdf-24.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";

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

export default function CoursePageTeacher() {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const courseID = useParams().courseID;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourse, setLoadedCourse] = useState();
  const [loadedCourseMaterials, setLoadedCourseMaterials] = useState();
  const [loadedCourseAssignments, setLoadedCourseAssignments] = useState();

  const navigate = useNavigate();
  const getToken = localStorage.getItem("token");

  const handleFileUpload = (event) => {
    if (event.target.files.length !== 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);
      axios
        .post(
          "http://localhost:5000/api/teachers/upload-material/" + courseID,
          formData,
          {
            headers: {
              Authorization: "Bearer " + getToken,
            },
          }
        )
        .then(function (response) {
          console.log(response);
          alert("File uploaded successfully");
        })
        .catch(function (error) {
          console.log(error);
          alert("File upload failed");
        });
    }
    // console.log(event.target.files[0].name);
  };

  const handleAssignmentUpload = (event) => {
    if (event.target.files.length !== 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);
      axios
        .post(
          "http://localhost:5000/api/teachers/upload-course-assignment/" +
            courseID,
          formData,
          {
            headers: {
              Authorization: "Bearer " + getToken,
            },
          }
        )
        .then(function (response) {
          console.log(response);
          alert("File uploaded successfully");
        })
        .catch(function (error) {
          console.log(error);
          alert("File upload failed");
        });
    }
    // console.log(event.target.files[0].name);
  };

  let url = "http://localhost:5000/api/courses/" + courseID;
  let url2 =
    localStorage.getItem("userRole") === "student"
      ? "http://localhost:5000/api/students/get-course-materials/" + courseID
      : "http://localhost:5000/api/teachers/get-materials/" + courseID;
  let url3;
  {
    localStorage.getItem("userRole" === "student")
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
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedCourse(responseData.course);
        console.log(responseData);
      } catch (err) {}
    };
    fetchCourse();
  }, [sendRequest, url, getToken]);

  useEffect(() => {
    const fetchCourseMaterials = async () => {
      try {
        const responseData = await sendRequest(url2, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedCourseMaterials(responseData.courseMaterials);
        console.log("istsiak", responseData.courseMaterials);
      } catch (err) {}
    };
    fetchCourseMaterials();
  }, [sendRequest, url2, getToken]);

  useEffect(() => {
    const fetchCourseAssignments = async () => {
      try {
        const responseData = await sendRequest(url3, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedCourseAssignments(responseData.courseAssignments);
      } catch (err) {}
    };
    fetchCourseAssignments();
  }, [sendRequest, url3, getToken]);

  return (
    <body className="d-flex flex-column justify-content-center">
      <section className="d-flex flex-column justify-content-between">
        <div
          className="text-end text-sm-start text-lg-end d-flex flex-column justify-content-between"
          id="courseteacher"
        >
          <p id="ctp">My courses &gt; CSE 408</p>
          <div className="container">
            {!isLoading && loadedCourse && (
              <h1 className="display-5 fw-bold" id="cth">
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
            <div id="ctdiv">
              <p id="ctp">Resources</p>
              {!isLoading &&
                loadedCourseMaterials &&
                loadedCourseMaterials.map((cmat) => (
                  <p id="ctp2">
                    <img src="assets/img/pdf-24.png" width="24" height="24" />
                    <a href={cmat.file} style={{ textDecoration: "none" }}>
                      {cmat.title}
                    </a>
                  </p>
                ))}
              <input
                type="file"
                accept="*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="contained-button-file"
              />
              <Link
                to={"/teacher/my/course/material-upload/" + courseID}
                style={{ textDecoration: "none" }}
              >
                Add Course Material
              </Link>
              {/* <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                  Upload Course Material
                </Button>
              </label> */}
              {/* <p id="ctp3">
                <FontAwesomeIcon icon="fas fa-plus-square" />
                &nbsp;Add Resources
              </p> */}
              <p id="ctp">Assesments</p>
              {!isLoading &&
                loadedCourseAssignments &&
                loadedCourseAssignments.map((cass) => (
                  <p id="ctp2">
                    {/* <img src="assets/img/icon%20(3).svg" /> */}
                    <a
                      href={cass.file}
                      style={{ textDecoration: "none" }}
                      download
                    >
                      {cass.title}
                    </a>
                  </p>
                ))}
              <input
                type="file"
                accept="*"
                onChange={handleAssignmentUpload}
                style={{ display: "none" }}
                id="contained-button-file"
              />
              <Link
                to={"/teacher/my/course/assignment-upload/" + courseID}
                style={{ textDecoration: "none" }}
              >
                Add Assignment
              </Link>
              {/* <p id="ctp3">
                <FontAwesomeIcon icon="fas fa-plus-square" />
                &nbsp;Add Assessment
              </p> */}
            </div>
          </div>
        </div>
      </section>
    </body>
  );
}
