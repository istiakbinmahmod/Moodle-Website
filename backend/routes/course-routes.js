const express = require("express");
const { check } = require("express-validator");

// const placesControllers = require('../controllers/places-controllers');
const coursesControllers = require("../controllers/course-controllers");
const adminControllers = require("../controllers/admin-controllers");

const router = express.Router();

router.get("/", coursesControllers.getCoursesList); // => localhost:5000/courses to show all the created courses

router.get("/:courseID", coursesControllers.getCourseById); // => localhost:5000/courses/:courseID to show a course by its ID

router.get("/:courseID/users", coursesControllers.getUsersByCourseId); // => localhost:5000/courses/:courseID/users to show all the users enrolled in a course


// );

router.patch(
  "/:courseID",
  [
    check("courseID").not().isEmpty(),
    check("courseTitle").not().isEmpty(),
    check("courseCreditHour").not().isEmpty(),
    check("courseDescription").not().isEmpty(),
    check("sessionID").not().isEmpty(),
  ],
  adminControllers.adminEditCourse // => localhost:5000/admin/edit-course to edit a course (only the title and credit hour)
);

router.delete("/:courseID", adminControllers.adminDeleteCourse); // => localhost:5000/admin/delete-course to delete a course

router.get("/get/courses/:sessionID", coursesControllers.getCourseBySessionID); // => localhost:5000/admin/get-course to get a course


router.get('/get/session/:sessionID', coursesControllers.getSessionNameBySessionId); // => localhost:5000/admin/get-sessions to get all the sessions


module.exports = router;
