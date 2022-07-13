const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');

const router = express.Router();

router.get('/', usersController.getUsers);
router.post('/login', usersController.login);
router.get('/:uid/courses', usersController.getCoursesByUserId); // => localhost:5000/users/:uid/courses to show all the courses he/she's enrolled in

module.exports = router;