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

import AllAssignmentsPage from "../Components/CoursePages/AllAssignmentsPage";
import CompletedAssignmentsPage from "../Components/CoursePages/CompletedAssignmentsPage";
import CoursePageForum from "../Components/CoursePages/CourseForumPage";
import CourseMaterialsPage from "../Components/CoursePages/CourseMaterialsPage";
import CreateAssignmentPage from "../Components/CoursePages/CreateAssignmentPage";
import CreateMaterialPage from "../Components/CoursePages/CreateMaterialPage";
import DueAssignmentsPage from "../Components/CoursePages/DueAssignmentsPage";
import ParticipantsPage from "../Components/CoursePages/ParticipantsPage";

function MainRouter() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/homepage" element={<Dashboard />} />
          <Route path="/teacher/homepage" element={<Dashboard />} />
          <Route path="/admin/homepage" element={<AdminDashboard />} />
          <Route path="/student/my-courses" element={<CoursePanel />} />
          <Route path="/teacher/my-courses" element={<CoursePanel />} />
          <Route
            path="/student/my/course/:courseTitle/:courseID"
            element={<CouseDetail />}
          />
          <Route
            path="/teacher/my/course/:courseTitle/:courseID"
            element={<CouseDetail />}
          />
          {/* forum   */}
          <Route
            path="/student/my/course/:courseTitle/:courseID/forum"
            element={<CoursePageForum />}
          />
          <Route
            path="/teacher/my/course/:courseTitle/:courseID/forum"
            element={<CoursePageForum />}
          />
          {/* forum post  */}
          {/* all assignments teacher  */}
          <Route
            path="/teacher/my/course/:courseTitle/:courseID/assignments"
            element={<AllAssignmentsPage />}
          />
          {/* upload assignments teacher  */}
          <Route
            path="/teacher/my/course/:courseTitle/:courseID/assignments/upload"
            element={<CreateAssignmentPage />}
          />
          {/* due assignment student  */}
          <Route
            path="/student/my/course/due-assignments/:courseTitle/:courseID"
            element={<DueAssignmentsPage />}
          />
          {/* completed assignment student  */}
          <Route
            path="/student/my/course/completed-assignments/:courseTitle/:courseID"
            element={<CompletedAssignmentsPage />}
          />
          {/* new submission  */}
          {/* edit submission  */}
          {/* all materials  */}
          <Route
            path="/student/my/course/:courseTitle/:courseID/materials"
            element={<CourseMaterialsPage />}
          />
          <Route
            path="/teacher/my/course/:courseTitle/:courseID/materials"
            element={<CourseMaterialsPage />}
          />
          {/* upload materials teacher */}
          <Route
            path="/teacher/my/course/:courseTitle/:courseID/materials/upload"
            element={<CreateMaterialPage />}
          />
          {/* create forum post  */}
          {/* participants list */}
          <Route
            path="/student/my/course/:courseTitle/:courseID/participants"
            element={<ParticipantsPage />}
          />
          <Route
            path="/teacher/my/course/:courseTitle/:courseID/participants"
            element={<ParticipantsPage />}
          />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/teacher/profile" element={<Profile />} />
          <Route path="/student/edit-profile" element={<EditProfile />} />
          <Route path="/teacher/edit-profile" element={<EditProfile />} />
          <Route path="/student/private-files" element={<PrivateFiles />} />
          <Route path="/teacher/private-files" element={<PrivateFiles />} />
          <Route
            path="/student/upload-private-files"
            element={<UploadPrivateFiles />}
          />
          <Route
            path="/teacher/upload-private-files"
            element={<UploadPrivateFiles />}
          />
          <Route path="/student/notifications" element={<Notifications />} />
          <Route path="/teacher/notifications" element={<Notifications />} />
        </Routes>
      </Router>
    </>
  );
}

export default MainRouter;
