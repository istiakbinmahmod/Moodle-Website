import React from "react";
import { Link, NavLink } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import "../../shared/components/Navigation/NavLinks.css";
import "./SessionItem.css";

const SessionItem = (props) => {
  return (
    <li className="session-item">
      <Card className="session-item__content">
        <Link to={`/sessions/${props.course_id}`}>
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
                <NavLink to={`/api/admin/create-course/${props.objID}`} exact>
                  CREATE COURSE
                </NavLink>
              </li>
              <li>
                <NavLink to={`/api/courses/get/courses/${props.objID}`} exact>
                  SEE ALL COURSES
                </NavLink>
              </li>
            </ul>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default SessionItem;
