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

export default function CourseForum() {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const courseID = useParams().courseID;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedForumPosts, setLoadedForumPosts] = useState();

  const navigate = useNavigate();
  // const getToken = auth.token;
  const getToken = localStorage.getItem("token");

  const uploadPost = async (event) => {
    event.preventDefault();
    let post_title;
    let post_description;

    if (document.getElementById("post_title").value !== "") {
      post_title = document.getElementById("post_title").value;
    }
    if (document.getElementById("post_description").value !== "") {
      post_description = document.getElementById("post_description").value;
    }
    alert(post_title);
    alert(post_description);
    try {
      let url;
      url = "http://localhost:5000/api/users/post/" + courseID;
      await sendRequest(
        url,
        "POST",
        //    formData,
        JSON.stringify({
          title: post_title,
          postDescription: post_description,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      alert("post sent");
      // navigate("/");
    } catch (error) {
      alert("post not sent");
    }
  };

  let url = "http://localhost:5000/api/users/get-all-posts/" + courseID;
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedForumPosts(responseData.posts);
        console.log("all posts", responseData);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, url]);

  return (
    <>
      <body className="d-flex flex-column justify-content-center">
        <section className="d-flex flex-column justify-content-between">
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
              <p id="fp">News Forum</p>
              <p id="fp1">General news and announcement:</p>
              <div className="row" id="fpr">
                <div className="col">
                  <p id="fp2">Discussion</p>
                </div>
                <div className="col">
                  <p id="fp2">Started By</p>
                </div>
                <div className="col">
                  <p id="fp2">Total replies</p>
                </div>
              </div>
              {!isLoading &&
                loadedForumPosts &&
                //   ? (
                //     <div className="row" id="fpr">
                //       <div className="col">
                //         <p id="fp2">---</p>
                //       </div>
                //       <div className="col">
                //         <p id="fp2">---</p>
                //       </div>
                //       <div className="col">
                //         <p id="fp2">---</p>
                //       </div>
                //     </div>
                //   ) : (
                loadedForumPosts.map((post) => (
                  <Link to={"/my/forum/" + courseID + "/" + post._id}>
                    <div className="row" id="fpr">
                      <div className="col">
                        <p id="fp2">{post.title}</p>
                      </div>
                      <div className="col">
                        <p id="fp2">{post.author}</p>
                      </div>
                      <div className="col">
                        <p id="fp2">{post.replies.length}</p>
                      </div>
                    </div>
                  </Link>
                ))}

              <div className="row" id="frr">
                <div className="col">
                  <p id="fp3">Create a forum post:</p>
                </div>
              </div>
            </div>
            <form encType={"multipart/form-data"}>
              <div className="form-group">
                {/* <label htmlFor="assignment_name">Assignment Name</label> */}
                <input
                  type="text"
                  className="form-control"
                  id="post_title"
                  aria-describedby="post_title"
                  placeholder="Post Title"
                  name="post_title"
                  // defaultValue={auction.product_name}
                />
              </div>
              <div className="form-group">
                {/* <label htmlFor="file">File</label> */}
                <input
                  type="text"
                  className="form-control"
                  id="post_description"
                  aria-describedby="post_description"
                  placeholder="post_description"
                  name="post_description"
                  // defaultValue={auction.address}
                />
              </div>
              <div className="d-grid gap-2 col-6 mx-auto text-container">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={uploadPost}
                >
                  Update
                </button>
              </div>
            </form>
            <div className="row" id="fr4">
              <div className="col" id="fcc">
                <button className="btn btn-primary" type="button" id="fbb">
                  Submit
                </button>
              </div>
            </div>
          </div>
          {/* </div> */}
        </section>
      </body>
    </>
  );
}
