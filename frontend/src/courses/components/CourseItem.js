import React, { useEffect, useState } from "react";

import "../../shared/components/Navigation/NavLinks.css";

import { Link, NavLink } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import "./CourseItem.css";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const CourseItem = (props) => {
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

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedSessionID && (
        <li className="course-item">
          <Card className="course-item__content">
            <Link to={`/api/courses/upload-course-materials/${props.objID}`}>
              <div className="course-item__info">
                <h2>
                  {"Course ID : "}
                  {props.courseID}
                </h2>
                <p>
                  {"Session ID : "}
                  {loadedSessionID}
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
                  <li>
                    <NavLink
                      to={`/api/admin/removeUser/course/${props.objID}`}
                      exact
                    >
                      REMOVE PARTICIPANT{" "}
                    </NavLink>{" "}
                  </li>{" "}
                </ul>
              </div>
            </Link>
          </Card>
        </li>
      )}
    </React.Fragment>
  );
};

export default CourseItem;
