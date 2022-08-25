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
import Notifications from "./Notifications/Notification";
import AdminLogin from "./Login/AdminLogin";

function MainRouter() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/homepage" element={<Dashboard />} />
          <Route path="/admin/homepage" element={<AdminDashboard />} />
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
          <Route path="/student/notifications" element={<Notifications />} />
        </Routes>
      </Router>
    </>
  );
}

export default MainRouter;
