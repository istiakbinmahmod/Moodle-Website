import React from "react";

import CourseItem from "./SessionItem";
import Card from "../../shared/components/UIElements/Card";
import "./SessionList.css";
import SessionItem from "./SessionItem";

const SessionList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No Sessions found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="sessions-list">
      {props.items.map((session_item) => (
        <SessionItem
          key={session_item.session_id}
          sessionID={session_item.sessionID}
          startDate={session_item.startDate}
          endDate={session_item.endDate}
          courses={session_item.courses}
        />
      ))}
    </ul>
  );
};

export default SessionList;
