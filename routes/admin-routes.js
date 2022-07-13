const express = require('express');
const { check } = require('express-validator');


const adminController = require('../controllers/admin-controllers'); //this one is to import admin-controllers.js

const router = express.Router();

router.get('/', adminController.getAdmin); // => localhost:5000/admin/.. if admin is logged in this page will be shown and if not it will redirect to login page

router.post('/login', adminController.adminLogin); // => localhost:5000/admin/login

router.get('/courses', adminController.getCoursesList); // => localhost:5000/admin/courses  to show all the created courses

router.post('/create-course', adminController.adminCreateCourse); // => localhost:5000/admin/create-course to create a new course

router.post('/create-session', adminController.adminCreateSession); // => localhost:5000/admin/create-session to create a new session

router.delete('/delete/:courseID', adminController.adminDeleteCourse); // => localhost:5000/admin/delete-course to delete a course

router.delete('/delete/:sessionID', adminController.adminDeleteSession); // => localhost:5000/admin/delete-session to delete a session

router.patch('/edit/:courseID', adminController.adminEditCourse); // => localhost:5000/admin/edit-course to edit a course (only the title and credit hour)

module.exports = router;