// import React from "react";
import React, { useEffect, useState } from "react";

import "../../shared/components/Navigation/NavLinks.css";

import { Link, NavLink } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import "./CourseItem.css";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const CourseItem = (props) => {
  //new get
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedSessionID, setLoadedSessionID] = useState();

  useEffect(() => {
    const fetchSessionID = async () => {
      try {
        let responseData = await sendRequest(
          `http://localhost:5000/api/courses/get/session/${props.sessionID}`
        );

        setLoadedSessionID(responseData.sessionName);
      } catch (err) {}
    };
    fetchSessionID();
  }, [sendRequest]);
  //new get
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {/* {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )} */}
      {!isLoading && loadedSessionID && (
        <li className="course-item">
          <Card className="course-item__content">
            <Link
              to={`/api/courses/upload-course-materials/${props.objID}`}
            >
              {/* <Link to={`/courses/${props.courseID}`}> */}
              {/* <Link to={`/${props.course_ud}/places`}> */}
              {/* <div className="course-item__image">
            <Avatar image={props.image} alt={props.name} />
          </div> */}
              <div className="course-item__info">
                <h2>
                  {"Course ID : "}
                  {props.courseID}
                </h2>
                <p>
                  {"Session ID : "}
                  {loadedSessionID}
                  {/* {props.sessionID} */}
                </p>
                <p>
                  {"Course Title : "}
                  {props.courseTitle}
                </p>
                <p>
                  {"Course Description : "}
                  {props.courseDescription}
                </p>
                <p>
                  {"Credit Hour : "}
                  {props.courseCreditHour}
                </p>
                <ul className="nav-links">
                  <li>
                    <NavLink to={`/api/courses/${props.objID}/users`} exact>
                      SEE ALL PARTICIPANTS
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/api/admin/edit/${props.objID}`} exact>
                      ADD PARTICIPANT
                    </NavLink>
                  </li>
                </ul>
                {/* <p>
                  {"Course Pariticipants : "}
                  {props.participants}
                </p> */}
                {/* <h3>
              {props.credit_hour}{" "}
              {props.credit_hour === 1 ? "Credit Hour" : "Credit Hours"}
            </h3> */}
              </div>
            </Link>
            {/* <Link to={`/${props.id}/places`}>
          <div className="course-item__image">
            <Avatar image={props.image} alt={props.name} />
          </div>
          <div className="course-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link> */}
          </Card>
        </li>
      )}
    </React.Fragment>
  );
};

export default CourseItem;
