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
import { RequireAuth } from "./RequireAuth";

import AllAssignmentsPage from "../Components/CoursePages/AllAssignmentsPage";
import CompletedAssignmentsPage from "../Components/CoursePages/CompletedAssignmentsPage";
import CoursePageForum from "../Components/CoursePages/CourseForumPage";
import CourseMaterialsPage from "../Components/CoursePages/CourseMaterialsPage";
import CreateAssignmentPage from "../Components/CoursePages/CreateAssignmentPage";
import CreateMaterialPage from "../Components/CoursePages/CreateMaterialPage";
import DueAssignmentsPage from "../Components/CoursePages/DueAssignmentsPage";
import ParticipantsPage from "../Components/CoursePages/ParticipantsPage";
import CourseForumPostPage from "./CoursePages/CourseForumPostPage";

function MainRouter() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/homepage"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher/homepage"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/homepage"
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/student/my-courses"
            element={
              <RequireAuth>
                <CoursePanel />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher/my-courses"
            element={
              <RequireAuth>
                <CoursePanel />
              </RequireAuth>
            }
          />
          <Route
            path="/student/my/course/:courseTitle/:courseID"
            element={
              <RequireAuth>
                <CouseDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher/my/course/:courseTitle/:courseID"
            element={
              <RequireAuth>
                <CouseDetail />
              </RequireAuth>
            }
          />
          {/* forum   */}
          <Route
            path="/student/my/course/:courseTitle/:courseID/forum"
            element={
              <RequireAuth>
                <CoursePageForum />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher/my/course/:courseTitle/:courseID/forum"
            element={
              <RequireAuth>
                <CoursePageForum />
              </RequireAuth>
            }
          />
          {/* forum post  */}
          <Route
            path="/student/my/course/:courseTitle/:courseID/forum/post/:postID"
            element={
              <RequireAuth>
                <CourseForumPostPage />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher/my/course/:courseTitle/:courseID/forum/post/:postID"
            element={
              <RequireAuth>
                <CourseForumPostPage />
              </RequireAuth>
            }
          />
          {/* all assignments teacher  */}
          <Route
            path="/teacher/my/course/:courseTitle/:courseID/assignments"
            element={
              <RequireAuth>
                <AllAssignmentsPage />
              </RequireAuth>
            }
          />
          {/* upload assignments teacher  */}
          <Route
            path="/teacher/my/course/:courseTitle/:courseID/assignments/upload"
            element={
              <RequireAuth>
                <CreateAssignmentPage />
              </RequireAuth>
            }
          />
          {/* due assignment student  */}
          <Route
            path="/student/my/course/due-assignments/:courseTitle/:courseID"
            element={
              <RequireAuth>
                <DueAssignmentsPage />
              </RequireAuth>
            }
          />
          {/* completed assignment student  */}
          <Route
            path="/student/my/course/completed-assignments/:courseTitle/:courseID"
            element={
              <RequireAuth>
                <CompletedAssignmentsPage />
              </RequireAuth>
            }
          />
          {/* new submission  */}
          {/* edit submission  */}
          {/* all materials  */}
          <Route
            path="/student/my/course/:courseTitle/:courseID/materials"
            element={
              <RequireAuth>
                <CourseMaterialsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher/my/course/:courseTitle/:courseID/materials"
            element={
              <RequireAuth>
                <CourseMaterialsPage />
              </RequireAuth>
            }
          />
          {/* upload materials teacher */}
          <Route
            path="/teacher/my/course/:courseTitle/:courseID/materials/upload"
            element={
              <RequireAuth>
                <CreateMaterialPage />
              </RequireAuth>
            }
          />
          {/* create forum post  */}
          {/* participants list */}
          <Route
            path="/student/my/course/:courseTitle/:courseID/participants"
            element={
              <RequireAuth>
                <ParticipantsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher/my/course/:courseTitle/:courseID/participants"
            element={
              <RequireAuth>
                <ParticipantsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/student/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/student/edit-profile"
            element={
              <RequireAuth>
                <EditProfile />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher/edit-profile"
            element={
              <RequireAuth>
                <EditProfile />
              </RequireAuth>
            }
          />
          <Route
            path="/student/private-files"
            element={
              <RequireAuth>
                <PrivateFiles />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher/private-files"
            element={
              <RequireAuth>
                <PrivateFiles />
              </RequireAuth>
            }
          />
          <Route
            path="/student/upload-private-files"
            element={
              <RequireAuth>
                <UploadPrivateFiles />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher/upload-private-files"
            element={
              <RequireAuth>
                <UploadPrivateFiles />
              </RequireAuth>
            }
          />
          <Route
            path="/student/notifications"
            element={
              <RequireAuth>
                <Notifications />
              </RequireAuth>
            }
          />
          <Route path="/teacher/notifications" element={<Notifications />} />
        </Routes>
      </Router>
    </>
  );
}

export default MainRouter;
