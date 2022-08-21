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
import "./Styles.css";
import logo from "../../img/Moodle-Logo.wine.png";
import fileLogo from "../../img/pdf-24.png";

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

export default function CourseForumPost() {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const courseID = useParams().courseID;
  const postID = useParams().postID;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPost, setLoadedPost] = useState();
  const [loadedPostReplies, setLoadedPostReplies] = useState();

  const navigate = useNavigate();
  // const getToken = auth.token;
  const getToken = localStorage.getItem("token");

  const uploadReply = async (event) => {
    event.preventDefault();
    let reply_description;

    if (document.getElementById("reply_description").value !== "") {
      reply_description = document.getElementById("reply_description").value;
    }
    alert(reply_description);
    try {
      let url;
      url = "http://localhost:5000/api/users/reply/" + postID;
      await sendRequest(
        url,
        "POST",
        //    formData,
        JSON.stringify({
          replyDescription: reply_description,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken,
        }
      );
      alert("reply sent");
      // navigate("/");
    } catch (error) {
      alert("reply not sent");
    }
  };

  let url = "http://localhost:5000/api/users/get-all-replies/" + postID;
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedPost(responseData.post);
        setLoadedPostReplies(responseData.replies);
        console.log("all posts", responseData);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, url]);

  return (
    <>
      <div
        className="text-end text-sm-start text-lg-end d-flex flex-column justify-content-between"
        id="forum"
      >
        <p id="ctp">My courses &gt; CSE 408</p>
        <div className="container">
          <h1 className="display-5 fw-bold" id="fth">
            CSE 408:Software Engineering
          </h1>
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
                    <a className="nav-link" href="#">
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
                    <a className="nav-link active" href="#">
                      Forum
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div>
            <p id="fp">News Forum</p>
            <p id="fp1">General news and announcement:</p>
            {!isLoading && loadedPost && (
              <div className="row" id="frepr">
                <div className="col" id="frepc">
                  <p id="fp5">
                    <img src="assets/img/f1.png" width="54" height="55" />
                    No CSE 408 sessional after 2 weeks.
                  </p>
                  <p id="fp6">By {loadedPost.author}</p>
                  <p id="fp7">{loadedPost.postDescription}</p>
                  {/* <p id="fp7">Dear Students,</p>
                  <p id="fp7">Please,stop doing all of ur projects.</p>
                  <p id="fp7">thank you</p> */}
                </div>
              </div>
            )}
            {/* <div className="row" id="frepr">
              <div className="col" id="frepc">
                <p id="fp5">
                  <img src="assets/img/f1.png" width="54" height="55" />
                  No CSE 408 sessional after 2 weeks.
                </p>
                <p id="fp6">By Dr.Istiak Masum-date</p>
                <p id="fp7">Dear Students,</p>
                <p id="fp7">Please,stop doing all of ur projects.</p>
                <p id="fp7">thank you</p>
              </div>
            </div> */}
            <p id="fp8">Replies:</p>
            {!isLoading &&
              loadedPostReplies &&
              loadedPostReplies.map((reply) => (
                <div className="row" id="fr5">
                  <div className="col" id="frepc2">
                    <p id="fp5">
                      {reply._id}
                      <img src="assets/img/f1.png" width="54" height="55" />
                      {reply.replyDescription}
                    </p>
                    <p id="fp6">By {reply.replier}</p>
                    <p id="fp7">{reply.replyDescription}</p>
                  </div>
                </div>
              ))}
            {/* <div className="row" id="fr5">
              <div className="col" id="frepc2">
                <p id="fp5">
                  <img src="assets/img/f1.png" width="54" height="55" />
                  No CSE 408 sessional after 2 weeks.
                </p>
                <p id="fp6">By Soham Khecha-date</p>
                <p id="fp7">Ok Sir,</p>
                <p id="fp7">Chill</p>
              </div>
            </div> */}
          </div>
          <div className="row" id="fr6">
            <div className="col" id="frepc3">
              <p /*style="text-align: left;color: var(--bs-blue);width: 170px;margin-bottom: 0px;"*/
              >
                Your Reply:
              </p>
            </div>
          </div>
          <form encType={"multipart/form-data"}>
            <div className="form-group">
              {/* <label htmlFor="file">File</label> */}
              <input
                type="text"
                className="form-control"
                id="reply_description"
                aria-describedby="reply_description"
                placeholder="reply_description"
                name="reply_description"
                // defaultValue={auction.address}
              />
            </div>
            <div className="d-grid gap-2 col-6 mx-auto text-container">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={uploadReply}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
