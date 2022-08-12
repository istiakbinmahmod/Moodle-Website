const express = require('express');
const { check } = require('express-validator');
const uploadFile = require("../middleware/file-upload");
const checkUserAuth = require("../middleware/check-auth-user");

const usersController = require('../controllers/users-controllers');

const router = express.Router();

router.get('/:uid', usersController.getUserById);
router.post('/login', usersController.login);
router.use(checkUserAuth);
router.get('/:uid/courses', usersController.getCoursesByUserId); // => localhost:5000/users/:uid/courses to show all the courses he/she's enrolled in
router.post('/upload-private-file/', uploadFile.single("file"), usersController.uploadPrivateFiles); // => localhost:5000/users/upload-private-file/:uid to upload a private file
router.get('/get-all-private-files/', usersController.getAllPrivateFiles); // => localhost:5000/users/get-all-private-files/ to get all the private files
router.get('/get-private-file/:privateFileID', usersController.getPrivateFileByID); // => localhost:5000/users/get-private-file/:privateFileID to get a private file
router.delete('/delete-private-file/:privateFileID', usersController.deletePrivateFileByID); // => localhost:5000/users/delete-private-file/:privateFileID to delete a private file
module.exports = router;