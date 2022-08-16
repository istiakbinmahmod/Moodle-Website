const express = require('express');
const { check } = require('express-validator');
const uploadFile = require("../middleware/file-upload");
const checkUserAuth = require("../middleware/check-auth-user");

const usersController = require('../controllers/users-controllers');
const { addFilePath } = require('../controllers/fileController');

const router = express.Router();

router.get('/:uid', usersController.getUserById);
router.post('/login', usersController.login);
router.use(checkUserAuth);
router.get('/:uid/courses', usersController.getCoursesByUserId); // => localhost:5000/users/:uid/courses to show all the courses he/she's enrolled in
router.post('/upload-private-file/', uploadFile.single("file"), addFilePath, usersController.uploadPrivateFiles); // => localhost:5000/users/upload-private-file/:uid to upload a private file
router.get('/get-all-private-files/', usersController.getAllPrivateFiles); // => localhost:5000/users/get-all-private-files/ to get all the private files
router.get('/get-private-file/:privateFileID', usersController.getPrivateFileByID); // => localhost:5000/users/get-private-file/:privateFileID to get a private file
router.delete('/delete-private-file/:privateFileID', usersController.deletePrivateFileByID); // => localhost:5000/users/delete-private-file/:privateFileID to delete a private file
router.patch('/update-profile', uploadFile.single("file"), addFilePath, usersController.updateProfile); // => localhost:5000/users/update-profile to update a user's profile
router.patch('/update-password', usersController.changePassword); // => localhost:5000/users/update-password to update a user's password
router.post('/post/:courseID', usersController.userPostinForum); // => localhost:5000/users/post/:courseID to post a message in a course )
router.get('/get-all-posts/:courseID', usersController.getForumPosts); // => localhost:5000/users/get-all-posts/:courseID to get all the posts in a course
router.get('/get-post/:postID', usersController.getForumPost); // => localhost:5000/users/get-post/:postID to get a post in a course
router.delete('/delete-post/:postID', usersController.deleteForumPost); // => localhost:5000/users/delete-post/:postID to delete a post in a course
router.post('/reply/:postID', usersController.replyToForumPost); // => localhost:5000/users/reply/:postID to reply to a post in a course
router.get('/get-all-replies/:postID', usersController.getRepliesOfForumPost); // => localhost:5000/users/get-all-replies/:postID to get all the replies to a post in a course
router.delete('/delete-reply/:replyID', usersController.deleteReplyOfForumPost); // => localhost:5000/users/delete-reply/:replyID to delete a reply to a post in a course
router.patch('/edit-post/:postID', usersController.editPost); // => localhost:5000/users/edit-post/:postID to edit a post in a course
router.patch('/edit-reply/:replyID', usersController.editReply); // => localhost:5000/users/edit-reply/:replyID to edit a reply to a post in a course

module.exports = router;