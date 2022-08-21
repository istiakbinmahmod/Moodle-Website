import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Course.css";
import { AuthContext } from "../../Context/AuthContext";
import { useHttpClient } from "../../Hooks/http-hook";
import Rest__img from "../../img/restaurant.jpg";
import RestCard from "../../Components/RestCard/RestCard";

function Course() {
  const auth = useContext(AuthContext);
  console.log(auth.userId);
  const course = useParams().courseID;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourses, setLoadedCourses] = useState();

  const navigate = useNavigate();
  //   const [user, setUser] = useState("");
  const getToken = auth.token;

  let url =
    "http://localhost:5000/api/users/" +
    localStorage.getItem("userId") +
    "/courses";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log(url);
        const responseData = await sendRequest(url);
        setLoadedCourses(responseData.courses);
        console.log(responseData);
      } catch (err) {}
    };
    fetchCourses();
  }, [sendRequest, url]);

  return (
    <>
      <div id="page-navbar" class="clearfix">
        <nav class="breadcrumb-nav">
          <span class="accesshide">Page path</span>
          <ul class="breadcrumb">
            <li>
              <a href="https://moodle.cse.buet.ac.bd/">Home</a>{" "}
              <span class="divider">
                {" "}
                <span class="accesshide ">
                  <span class="arrow_text">/</span>&nbsp;
                </span>
                <span class="arrow sep">►</span>{" "}
              </span>
            </li>
            <li>
              <a href="https://moodle.cse.buet.ac.bd/my/">My courses</a>{" "}
              <span class="divider">
                {" "}
                <span class="accesshide ">
                  <span class="arrow_text">/</span>&nbsp;
                </span>
                <span class="arrow sep">►</span>{" "}
              </span>
            </li>
            <li>
              <a href="https://moodle.cse.buet.ac.bd/course/index.php?categoryid=33">
                January 2022
              </a>{" "}
              <span class="divider">
                {" "}
                <span class="accesshide ">
                  <span class="arrow_text">/</span>&nbsp;
                </span>
                <span class="arrow sep">►</span>{" "}
              </span>
            </li>
            <li>
              <a
                title="January 2022 CSE406: Computer Security Sessional"
                href="https://moodle.cse.buet.ac.bd/course/view.php?id=704"
              >
                January 2022 CSE406
              </a>
            </li>
          </ul>
        </nav>
        <div class="breadcrumb-button"></div>
      </div>
      <h1>{course}</h1>
    </>
  );
}

export default Course;
