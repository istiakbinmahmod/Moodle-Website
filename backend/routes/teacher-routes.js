const express = require('express');
const { check } = require('express-validator');

const teacherController = require('../controllers/teacher-controller');
const { route } = require('./admin-routes');
const uploadFile = require("../middleware/file-upload");
const router = express.Router();

router.get('/get-materials/:courseID', teacherController.getCourseMaterials); // => localhost:5000/teacher/course-materials/:courseID to get all the materials of a course
router.post('/upload-material/:courseID', uploadFile.single("file"), teacherController.uploadCourseMaterials); // => localhost:5000/teacher/create-material/:courseID to create a new material
router.delete('/delete-material/:courseID', teacherController.deleteCourseMaterials); // => localhost:5000/teacher/delete-material/:materialID to delete a material

router.post('/upload-course-assignment/:courseID', uploadFile.single("file"), teacherController.uploadCourseAssignment); // => localhost:5000/teacher/create-assignment/:courseID to create a new assignment
router.patch('/update-course-assignment/:assignmentID', uploadFile.single("file"), teacherController.updateCourseAssignment); // => localhost:5000/teacher/update-assignment/:assignmentID to update an assignment
router.delete('/delete-course-assignment/:courseID', teacherController.deleteCourseAssignment); // => localhost:5000/teacher/delete-assignment/:assignmentID to delete an assignment
router.get('get-all-course-assignment/:courseID', teacherController.getAllCourseAssignments); // => localhost:5000/teacher/get-assignment/:courseID to get all the assignments of a course
router.get('get-course-assignment/:assignmentID', teacherController.getCourseAssignmentByAssignmentD); // => localhost:5000/teacher/get-assignment/:assignmentID to get an assignment

module.exports = router;