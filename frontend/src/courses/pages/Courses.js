import React from "react";

import CourseList from "../components/CourseList";
// import UsersList from '../components/UsersList';

const Courses = () => {
  // const COURSES = [
  //   {
  //     id: "410",
  //     name: "Computer Graphics Sessional",
  //     image:
  //       "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  //     places: 3,
  //   },
  const COURSES = [
    {
      courseID: "CSE 405",
      sessionID: "Jan 2020",
      courseTitle: "Computer Security",
      courseDescription: "Computer Security",
      courseCreditHour: 3,
      participants: [],
    },
  ];

  return <CourseList items={COURSES} />;
};

export default Courses;
