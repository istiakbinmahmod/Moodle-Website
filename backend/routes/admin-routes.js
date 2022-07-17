const express = require('express');
const { check } = require('express-validator');


const adminController = require('../controllers/admin-controllers'); //this one is to import admin-controllers.js

const router = express.Router();

router.get('/', adminController.getAdmin); // => localhost:5000/admin/.. if admin is logged in this page will be shown and if not it will redirect to login page

router.post('/login', adminController.adminLogin); // => localhost:5000/admin/login

router.get('/courses', adminController.getCoursesList); // => localhost:5000/admin/courses  to show all the created courses

router.post('/create-course', adminController.adminCreateCourse); // => localhost:5000/admin/create-course to create a new course

router.delete('/delete/:courseID', adminController.adminDeleteCourse); // => localhost:5000/admin/delete-course to delete a course

router.patch('/edit/:courseID', adminController.adminEditCourse); // => localhost:5000/admin/edit-course to edit a course 

router.post('/create/user', adminController.adminCreateUser); // => localhost:5000/admin/create-user to create a new user')

router.get('/get/users', adminController.getUsersList); // => localhost:5000/admin/create-user to create a new user')`

router.patch('/edit/user/:userID', adminController.adminEditUser); // => localhost:5000/admin/edit-user to edit a user (only the name and email)

router.delete('/delete/user/:userID', adminController.adminDeleteUser); // => localhost:5000/admin/delete-user to delete a user

router.patch('/removeUser/course/:courseID', adminController.adminRemovesFromCourse); // => localhost:5000/admin/delete-all to delete user from course

router.post('/create-session', adminController.adminCreateSession); // => localhost:5000/admin/create-session to create a new session

router.delete('/delete/session/:sessionID', adminController.adminDeleteSession); // => localhost:5000/admin/delete-session to delete a session







module.exports = router;