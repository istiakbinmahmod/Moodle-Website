const express = require('express');
const { check } = require('express-validator');

const studentController = require('../controllers/student-controller');
const fileUpload = require("../middleware/file-upload");
const checkAuthStudent = require("../middleware/check-auth-student");
const { addFilePath, addMultipleImages } = require('../controllers/fileController')

const router = express.Router();

router.get('/get-all-courses', studentController.getAllCourses); // => localhost:5000/api/students/get-all-courses to get all the courses

router.use(checkAuthStudent);

router.get('/get-my-courses', studentController.getEnrolledCourses); // => localhost:5000/api/students/get-my-courses to get all the courses of a student 

router.get('/get-course-materials/:courseID', studentController.getCourseMaterials);

router.get('/get-all-course-assignments/:courseID', studentController.getAllCourseAssignments);

router.get('/get-course-assignment/:assignmentID', studentController.getCourseAssignmentByAssignmentD);

router.post('/upload-submission/:assignmentID', fileUpload.single("file"), addFilePath, studentController.uploadSubmission);

router.patch('/update-submission/:submissionID', fileUpload.single("file"), addFilePath, studentController.updateSubmission);

router.delete('/delete-submission/:submissionID', studentController.deleteSubmission);

router.get('get-submission/:assignmentID', studentController.getSubmissionByAssignmentID);

router.get('/download-course-material/:courseMaterialID', studentController.downloadCourseMaterial);

router.get('/download-course-assignment/:assignmentID', studentController.downloadAssignmentMaterial);

module.exports = router;