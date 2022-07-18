import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

// import Users from "./user/pages/Users";
import NewCourse from "./courses/pages/NewCourse";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Courses />
        </Route>
        <Route path="/api/courses/:courseID/users" exact>
          <CourseUsers />
        </Route>
        <Route path="/get/sessions" exact>
          <Sessions />
        </Route>
        <Route path="/get/sessions" exact>
          <Sessions />
        </Route>
        <Route path="/api/courses/get/courses/:sessionId">
          <CourseSession />
        </Route>
        <Route path="/sessions/:sessionId">
          <UpdatePlace />
        </Route>
        <Route path="/api/admin/create/user" exact>
          <NewUser />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/api/admin/create-course" exact>
          <NewCourse />
        </Route>
        <Route path="/api/admin/create-session" exact>
          <NewSession />
        </Route>
        <Route path="/api/admin/create-course/:sessionID" exact>
          <SessionCreateCourse />
        </Route>
        <Route path="/api/admin/delete-course" exact>
          <DeleteCourse />
        </Route>
        <Route path="/api/admin/edit-course" exact>
          <NewCourse />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Route path="/courses/:courseId">
          <UpdatePlace />
        </Route>
        <Route path="/sessions/:sessionId">
          <UpdatePlace />
        </Route>

        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Courses />
        </Route>
        <Route path="/get/sessions" exact>
          <Sessions />
        </Route>
        <Route path="/api/courses/get/courses/:sessionId">
          <CourseSession />
        </Route>
        <Route path="/sessions" exact>
          <Sessions />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
        {/* <Route path="/api/admin/login">
          <Auth />
        </Route>
        <Redirect to="/api/admin/login" /> */}
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
