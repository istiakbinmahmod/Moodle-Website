import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/StudentDashboard/StudentDashboard";
import CouseDetail from "./CourseDetail/Course";
import AdminDashboard from "./Admin/SuperUserDashboard";
import CoursePanel from "./CourseDetail/CoursePanel";
import Profile from "./Profile/ProfilePage";
import EditProfile from "./Profile/EditProfile";
import PrivateFiles from "./Profile/PrivateFiles";
import UploadPrivateFiles from "./Profile/UploadPrivateFiles";

function MainRouter() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/homepage" element={<Dashboard />} />
          <Route path="/student/my-courses" element={<CoursePanel />} />
          <Route
            path="/student/my/course/:courseTitle/:courseID"
            element={<CouseDetail />}
          />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/edit-profile" element={<EditProfile />} />
          <Route path="/student/private-files" element={<PrivateFiles />} />
          <Route
            path="/student/upload-private-files"
            element={<UploadPrivateFiles />}
          />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default MainRouter;
