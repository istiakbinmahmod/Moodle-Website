import logo from "./logo.svg";
import "./App.css";

import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";
import { hot } from "react-hot-loader";

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// IMPORT ALL THE COMPONENTS, CONTEXTS AND HOOKS
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import { AuthContext } from "./Context/AuthContext";
import { useAuth } from "./Context/auth-hook";

// IMPORT ALL THE PAGES
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Homepage from "./Pages/Homepage/Homepage";
import Course from "./Pages/Course/Course";
import MyCourses from "./Pages/Course/MyCourses";
import CoursePage from "./Pages/Course/CoursePage";
import AssignmentSubmit from "./Pages/Assignment/AssignmentSubmit";
import Profile from "./Pages/Profile/Profile";
import AllCourses from "./Pages/Course/AllCourses";
import CoursePageTeacher from "./Pages/Course/CoursePageTeacher";
import CourseMaterialUpload from "./Pages/CourseMaterial/CourseMaterialUpload";
import CourseForum from "./Pages/Forum/CourseForum";
import CourseForumPost from "./Pages/Forum/CourseForumPost";
import StudentSubmission from "./Pages/Submission/StudentSubmission";

function App() {
  const { token, login, logout, userId, userRole } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          userRole: userRole,
          login: login,
          logout: logout,
        }}
      >
        {/* <React.Fragment> */}

        <Router>
          <Navbar isLoggedIn={!!token} userRole={userRole} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/courses" element={<AllCourses />} />
            {/* <Route path="/homepage" element={<Homepage />} /> */}
            <Route path="/course/:courseID" element={<Course />} />
            <Route path="/profile/:uid" element={<Profile />} />
            <Route path="/my/course/:courseID" element={<CoursePage />} />
            <Route
              path="/teacher/my/course/:courseID"
              element={<CoursePageTeacher />}
            />
            <Route path="/my/forum/:courseID" element={<CourseForum />} />
            <Route
              path="/my/forum/:courseID/:postID"
              element={<CourseForumPost />}
            />
            <Route
              path="/teacher/my/course/assignment-upload/:courseID/"
              element={<AssignmentSubmit />}
            />
            <Route
              path="/teacher/my/course/material-upload/:courseID/"
              element={<CourseMaterialUpload />}
            />
            <Route
              path="/my/course/submission/:courseID/:assignmentID"
              element={<StudentSubmission />}
            />
            {/* <Route  */}
          </Routes>
          <Footer />
        </Router>

        {/* </React.Fragment> */}
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
