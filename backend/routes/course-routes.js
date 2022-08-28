const express = require("express");

// const placesControllers = require('../controllers/places-controllers');
const coursesControllers = require("../controllers/course-controllers");


const router = express.Router();

router.get("/", coursesControllers.getCoursesList); // => localhost:5000/courses to show all the created courses

router.get("/:courseID", coursesControllers.getCourseById); // => localhost:5000/courses/:courseID to show a course by its ID

router.get("/:courseID/users", coursesControllers.getUsersByCourseId); // => localhost:5000/courses/:courseID/users to show all the users enrolled in a course




router.get("/get/courses/:sessionID", coursesControllers.getCourseBySessionID); // => localhost:5000/admin/get-course to get a course

router.get(
    "/get/session/:sessionID",
    coursesControllers.getSessionNameBySessionId
); // => localhost:5000/admin/get-sessions to get all the sessions

router.get("/fetch-stuffs/:courseID", coursesControllers.fetchCourseStuffs); // => localhost:5000/admin/fetch-stuffs to get all the stuffs of a course

router.get("/get-students/:courseID", coursesControllers.getStudentsByCourseId); // => localhost:5000/admin/get-students to get all the students of a course
router.get("/get-teachers/:courseID", coursesControllers.getTeachersByCourseId); // => localhost:5000/admin/get-teachers to get all the teachers of a course

module.exports = router; // => localhost:5000/courses to show all the created courses