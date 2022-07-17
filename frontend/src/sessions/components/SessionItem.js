import React from "react";
import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
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
            <h2>{props.session_id}</h2>
            <h3>
              {"Start Date : "}
              {props.start_date}
              {/* {props.credit_hour === 1 ? "Credit Hour" : "Credit Hours"} */}
            </h3>
            <h3>
              {"End Date : "}
              {props.end_date}
              {/* {props.credit_hour === 1 ? "Credit Hour" : "Credit Hours"} */}
            </h3>
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
