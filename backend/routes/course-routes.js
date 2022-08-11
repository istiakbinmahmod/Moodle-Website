const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

// const placesControllers = require('../controllers/places-controllers');
const coursesControllers = require("../controllers/course-controllers");
const adminControllers = require("../controllers/admin-controllers");
const uploadFile = require("../middleware/file-upload");

const router = express.Router();

router.get("/", coursesControllers.getCoursesList); // => localhost:5000/courses to show all the created courses

router.get("/:courseID", coursesControllers.getCourseById); // => localhost:5000/courses/:courseID to show a course by its ID

router.get("/:courseID/users", coursesControllers.getUsersByCourseId); // => localhost:5000/courses/:courseID/users to show all the users enrolled in a course

// );


// router.post("/upload-course-materials/:courseID", uploadFile.single('file'), coursesControllers.uploadCourseMaterials); // => localhost:5000/courses/upload-course-materials/:courseID to upload a course materials
router.post(
    "/upload-course-materials/:courseID",
    uploadFile.single("file"),
    // (req, res) => {
    //     console.log(req.file);
    //     res.send(" Single File upload successfull");
    // }
    coursesControllers.uploadCourseMaterials
); // => localhost:5000/courses/upload-course-materials/:courseID to upload a course materials



router.get("/get/courses/:sessionID", coursesControllers.getCourseBySessionID); // => localhost:5000/admin/get-course to get a course

router.get(
    "/get/session/:sessionID",
    coursesControllers.getSessionNameBySessionId
); // => localhost:5000/admin/get-sessions to get all the sessions

module.exports = router; // => localhost:5000/courses to show all the created courses