// import React from "react";
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import "./CourseItem.css";

const CourseItem = (props) => {
  //new get
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedSessionID, setLoadedSessionID] = useState();

  useEffect(() => {
    const fetchSessionID = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users"
        );

        setLoadedSessionID(responseData.users);
      } catch (err) {}
    };
    fetchSessionID();
  }, [sendRequest]);
  //new get
  return (
    <li className="course-item">
      <Card className="course-item__content">
        <Link to={`/courses/${props.courseID}`}>
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
              {props.sessionID}
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
            <p>
              {"Course Pariticipants : "}
              {props.participants}
            </p>
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
  );
};

export default CourseItem;
