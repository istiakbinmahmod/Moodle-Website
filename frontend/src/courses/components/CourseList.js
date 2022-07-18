import React from "react";

import CourseItem from "./CourseItem";
import Card from "../../shared/components/UIElements/Card";
import "./CourseList.css";

const CourseList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No courses found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="courses-list">
      {props.items.map((user) => (
        <CourseItem
          key={user.courseID}
          courseID={user.courseID}
          sessionID={user.sessionID}
          courseTitle={user.courseTitle}
          courseDescription={user.courseDescription}
          courseCreditHour={user.courseCreditHour}
          participants={user.participants}
          objID={user._id}
          // key={user.id}
          // id={user.id}
          // image={user.image}
          // name={user.name}
          // placeCount={user.places}
        />
      ))}
    </ul>
  );
};

export default CourseList;
