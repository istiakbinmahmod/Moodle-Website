import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
// import Register from './Registration/Registration';
import Dashboard from "./Dashboard/Teams/Teams";
// import Grade from './Dashboard/Grade/Grade';
// import Assignment from './Dashboard/Assignment/Assignment';
// import StudentList from './Dashboard/StudentList/StudentList';
// import Chat from './Dashboard/Chat/Chat';
// import AssignmentDetail from './Dashboard/Assignment/AssignmentDetail';
import CouseDetail from "./CourseDetail/Course";
import AdminDashboard from "./Admin/SuperUserDashboard";
// import InstructorDashboard from './Admin/Instructor/InstructorBoard';
// import SuperUserDashboard from './SuperUser/SuperUserDashboard';

function MainRouter() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/homepage" element={<Dashboard />} />
          <Route
            path="/my/course/:courseTitle/:courseID"
            element={<CouseDetail />}
          />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default MainRouter;
