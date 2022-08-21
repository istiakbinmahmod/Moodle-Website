import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Course.css";
import Rest__img from "../../img/restaurant.jpg";
import RestCard from "../../Components/RestCard/RestCard";
import { FaArrowRight } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../../Context/AuthContext";
import { useHttpClient } from "../../Hooks/http-hook";

function AllCourses() {
  const auth = useContext(AuthContext);
  console.log(auth.userId);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourses, setLoadedCourses] = useState();

  const navigate = useNavigate();
  const getToken = auth.token;

  let url = "http://localhost:5000/api/students/get-all-courses/";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log(url);
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedCourses(responseData.courses);
        console.log(responseData);
      } catch (err) {}
    };
    fetchCourses();
  }, [sendRequest, url]);

  return (
    <>
      <body className="d-flex flex-column justify-content-center">
        <section className="d-flex flex-column justify-content-between">
          <div
            className="text-end text-sm-start text-lg-end d-flex flex-column justify-content-between"
            id="courses"
          >
            <div className="container" id="con">
              <h1 className="display-5 fw-bold" id="ch">
                All Courses
              </h1>
              {!isLoading &&
                loadedCourses &&
                loadedCourses.map((course) => {
                  return (
                    <Link
                      to={"/my/course/" + course.id}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="row">
                        <div className="col" id="col">
                          <p id="cpar">
                            {course.sessionName} {course.courseID} :{" "}
                            {course.courseTitle}
                          </p>
                          <p id="cpar2">
                            <img src="../../img/icon.svg" />
                            There are new forum posts
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </section>
        <script src="../../bootstrap/js/bootstrap.min.js"></script>
        <script src="../../js/bs-init.js"></script>
      </body>
    </>
  );
}

export default AllCourses;
