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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import "./Styles.css";
import logo from "../../img/Moodle-Logo.wine.png";
import avatar from "../../img/avatar.jpeg";

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

export default function Profile() {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const uid = useParams().uid;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();
  const [loadedUserCourses, setLoadedUserCourses] = useState();

  const navigate = useNavigate();
  const getToken = localStorage.getItem("token");

  let url = "http://localhost:5000/api/users/" + uid;
  let url2 =
    localStorage.getItem("userRole") === "student"
      ? "http://localhost:5000/api/students/get-my-courses"
      : "http://localhost:5000/api/teachers/get-my-courses";
  // + uid + "/courses";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(url);
        setLoadedUser(responseData.user);
        console.log(responseData);
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, url]);

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const responseData = await sendRequest(url2, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedUserCourses(responseData.courses);
        console.log(responseData);
      } catch (err) {}
    };
    fetchUserCourses();
  }, [sendRequest, url2]);

  return (
    <>
      <div
        className="text-end text-sm-start text-lg-end d-flex flex-column justify-content-between"
        id="pro"
      >
        <div className="container" id="pcon">
          <div className="row">
            <div className="col-md-6" id="pcol2">
              {!isLoading && loadedUser && (
                <p id="ppar">
                  <img alt="" src={avatar} width="40" height="40" />
                  {loadedUser.name}
                </p>
              )}
            </div>
            <div className="col-md-6" id="pcol3">
              <p id="ppar2">Student</p>
            </div>
          </div>
          <p id="ppar3">
            Description&nbsp;<i className="fas fa-edit" id="pi"></i>
          </p>
          <div className="row" id="prow">
            <div className="col" id="pcol4">
              {!isLoading && loadedUser ? (
                <p id="ppar4">{loadedUser.bio}</p>
              ) : (
                <p id="ppar4">No Description Yet</p>
              )}
              <p id="ppar4">
                {/* I am Istiak .<i />
                My nickname is Masum.My Student Id is 1705073. */}
              </p>
              {/* <p id="ppar5">I am a front end react js Developer.</p> */}
            </div>
          </div>
          <div className="row">
            {!isLoading && loadedUser && (
              <div className="col-md-6" id="pcol4">
                <p id="ppar6">
                  User Details&nbsp;
                  <i className="fas fa-edit" id="pi"></i>
                </p>
                <p id="pi2">Email Address: {loadedUser.email}</p>
                <p id="pi2">Country : Bangladesh</p>
                <p id="pi2">City/Town : Dhaka</p>
                <p id="pi2">Contact Number: 01521115388</p>
              </div>
            )}
            <div className="col" id="pdiv2">
              <p id="ppar7">Course Details</p>
              {!isLoading &&
                loadedUserCourses &&
                loadedUserCourses.map((course) => (
                  <Link to={"/my/course/" + course._id}>
                    <p id="ppar8">
                      {course.sessionName} {course.courseID}:{" "}
                      {course.courseTitle}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
