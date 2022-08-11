const express = require('express');
const { check } = require('express-validator');

const teacherController = require('../controllers/teacher-controller');
const { route } = require('./admin-routes');
const uploadFile = require("../middleware/file-upload");
const router = express.Router();

router.get('/get-materials/:courseID', teacherController.getCourseMaterials); // => localhost:5000/teacher/course-materials/:courseID to get all the materials of a course
router.post('/upload-material/:courseID', uploadFile.single("file"), teacherController.uploadCourseMaterials); // => localhost:5000/teacher/create-material/:courseID to create a new material
router.delete('/delete-material/:courseID', teacherController.deleteCourseMaterials); // => localhost:5000/teacher/delete-material/:materialID to delete a material

module.exports = router;