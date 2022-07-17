import React from "react";
import { Link, NavLink } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import "../../shared/components/Navigation/NavLinks.css";
import "./SessionItem.css";

const SessionItem = (props) => {
  return (
    <li className="session-item">
      <Card className="session-item__content">
        <Link to={`/sessions/${props.course_id}`}>
          {/* <Link to={`/${props.course_ud}/places`}> */}
          {/* <div className="course-item__image">
            <Avatar image={props.image} alt={props.name} />
          </div> */}
          <div className="session-item__info">
            <h2>
              {"Session ID : "}
              {props.sessionID}
            </h2>
            <h2>
              {"Start Date : "}
              {props.startDate}
            </h2>
            <h2>
              {"End Date : "}
              {props.endDate}
            </h2>
            <ul className="nav-links">
              <li>
                <NavLink to={`/get/courses/${props.sessionID}`} exact>
                  SEE ALL COURSES
                </NavLink>
              </li>
            </ul>
            {/* <NavLink to="/" exact>
              SEE ALL COURSES
            </NavLink> */}
            {/* <h2>
              {"Courses : "}
              {props.courses}
            </h2> */}
            {/* {props.courses.map((course) => (
              <h2>
                {"Course : siuu"}
                {course.courseID}
              </h2>
            ))} */}
            {/* <h3>
              {"Start Date : "}
              {props.start_date}
              {props.credit_hour === 1 ? "Credit Hour" : "Credit Hours"}
            </h3>
            <h3>
              {"End Date : "}
              {props.end_date}
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

export default SessionItem;
