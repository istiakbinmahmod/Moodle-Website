import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import NewCourse from "./courses/pages/NewCourse";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import Courses from "./courses/pages/Courses";
import NewUser from "./user/pages/NewUser";
import DeleteCourse from "./courses/pages/DeleteCourse";
import Sessions from "./sessions/pages/Sessions";
import NewSession from "./sessions/pages/NewSession";
import CourseSession from "./sessions/pages/CourseSession";
import CourseUsers from "./courses/pages/CourseUsers";
import SessionCreateCourse from "./sessions/pages/SessionCreateCourse";
import CourseAddParticipants from "./courses/pages/CourseAddParticipants";
import CourseMaterialUpload from "./courses/pages/CourseMaterialUpload";
import CourseRemoveParticipants from "./courses/pages/CourseRemoveParticipants";
import NewStudent from "./user/pages/NewStudent";
import NewTeacher from "./user/pages/NewTeacher";
import UserAuth from "./user/pages/UserAuth";
import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Courses />
        </Route>{" "}
        <Route path="/api/courses/:courseID/users" exact>
          <CourseUsers />
        </Route>{" "}
        <Route path="/get/sessions" exact>
          <Sessions />
        </Route>{" "}
        <Route path="/api/courses/get/courses/:sessionId">
          <CourseSession />
        </Route>{" "}
        <Route path="/api/admin/edit/:courseID">
          <CourseAddParticipants />
        </Route>{" "}
        <Route path="/api/admin/create/user" exact>
          <NewUser />
        </Route>{" "}
        <Route path="/api/admin/create/student" exact>
          <NewStudent />
        </Route>{" "}
        <Route path="/api/admin/create/teacher" exact>
          <NewTeacher />
        </Route>{" "}
        <Route path="/api/admin/create-session" exact>
          <NewSession />
        </Route>{" "}
        <Route path="/api/admin/create-course/:sessionID" exact>
          <SessionCreateCourse />
        </Route>{" "}
        <Route path="/api/admin/delete-course" exact>
          <DeleteCourse />
        </Route>{" "}
        <Route path="/api/admin/edit-course" exact>
          <NewCourse />
        </Route>{" "}
        <Route path="/api/courses/upload-course-materials/:courseID" exact>
          <CourseMaterialUpload />
        </Route>{" "}
        <Route path="/api/admin/removeUser/course/:courseID" exact>
          <CourseRemoveParticipants />
        </Route>{" "}
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Courses />
        </Route>{" "}
        <Route path="/get/sessions" exact>
          <Sessions />
        </Route>{" "}
        <Route path="/api/courses/get/courses/:sessionId">
          <CourseSession />
        </Route>{" "}
        <Route path="/sessions" exact>
          <Sessions />
        </Route>{" "}
        <Route path="/auth">
          <Auth />
        </Route>{" "}
        <Route path="/user">
          <UserAuth />
        </Route>{" "}
        <Redirect to="/auth" />{" "}
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main> {routes} </main>{" "}
      </Router>{" "}
    </AuthContext.Provider>
  );
};

export default App;
