const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator"); //this one is to validate the inputs
const mongoose = require("mongoose");
const Course = require("../models/courses");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");
const express = require("express");
const router = express.Router();
const PrivateFile = require("../models/private_files");
const Forum = require("../models/course-forum");
const ForumPost = require("../models/course-forum");
const PostReply = require("../models/post-reply");
const { ConnectionCheckOutStartedEvent } = require("mongodb");

const getUserById = async(req, res, next) => {
    const userId = req.params.uid;
    const user = await User.findById(userId);
    if (!user) {
        throw new HttpError("Could not find a user for this id.", 404);
    }
    res.json({ user: user });
};

const login = async(req, res, next) => {
    const { moodleID, password } = req.body;
    console.log(req.body);
    let existingUser;
    try {
        existingUser = await User.findOne({ moodleID: moodleID });
    } catch (err) {
        console.log(err);
        return next(new HttpError("Something went wrong, could not login.", 500));
    }
    if (!existingUser) {
        return next(new HttpError("Could not login, wrong credentials.", 401));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        console.log(err);
        return next(new HttpError("Something went wrong, could not login.", 500));
    }

    if (!isValidPassword) {
        return next(new HttpError("Could not login, wrong credentials.", 401));
    }

    let token;
    try {
        if (existingUser.role === "student") {
            token = jwt.sign({ userId: existingUser.id, moodleID: existingUser.moodleID },
                "supersecret_dont_share_student", { expiresIn: "1h" }
            );
        }
        if (existingUser.role === "teacher") {
            token = jwt.sign({ userId: existingUser.id, moodleID: existingUser.moodleID },
                "supersecret_dont_share_teacher", { expiresIn: "1h" }
            );
        }
    } catch (err) {
        console.log(err);
        return next(new HttpError("Something went wrong, could not login.", 500));
    }

    res.json({
        userId: existingUser.id,
        moodleID: existingUser.moodleID,
        userRole: existingUser.role,
        token: token,
    });
};

const getCoursesByUserId = async(req, res, next) => {
    const userId = req.params.uid;
    const user = await User.findById(userId);
    if (!user) {
        console.log(err);
        return next(new HttpError("Could not find a user for this id.", 404));
    }

    let coursesOfUser;
    try {
        coursesOfUser = await User.findById(userId).populate("courses");
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Something went wrong, could not get courses.", 500)
        );
    }
    if (!coursesOfUser || coursesOfUser.length === 0) {
        return next(new HttpError("Could not get courses, no courses found.", 404));
    }
    res.json({
        courses: coursesOfUser.courses.map((course) =>
            course.toObject({ getters: true })
        ),
    });
};



const uploadPrivateFiles = async(req, res, next) => {
    const userID = req.userData.userId;
    const user = await User.findById(userID);

    if (!user) {
        console.log(err);
        return next(
            new HttpError("Something went wrong could not get the specific user", 500)
        );
    }

    const { downLoadURL } = req.file;

    const createdPrivateFile = new PrivateFile({
        user: userID,

        file: downLoadURL,

    });

    try {
        await createdPrivateFile.save();
        const session = await mongoose.startSession();
        session.startTransaction();
        await createdPrivateFile.save({ session: session });
        await user.privateFiles.push(createdPrivateFile);
        await user.save({ session: session });
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Something went wrong, could not upload file.", 500)
        );
    }

    res.status(201).json({
        message: "File uploaded successfully!",
        createdPrivateFile: createdPrivateFile,
        user: user,
    });
};

const getAllPrivateFiles = async(req, res, next) => {
    const userID = req.userData.userId;
    const user = await User.findById(userID);

    if (!user) {
        console.log(err);
        return next(
            new HttpError("Something went wrong could not get the specific user", 500)
        );
    }

    let privateFiles;
    try {
        privateFiles = await PrivateFile.find({ user: userID });
    } catch (err) {
        console.log(err);
        return next(
            new HttpError(
                "Something went wrong, could not get the private files.",
                500
            )
        );
    }
    if (!privateFiles || privateFiles.length === 0) {
        return next(
            new HttpError(
                "Could not get the private files, no private files found.",
                404
            )
        );
    }
    res.json({
        privateFiles: privateFiles.map((privateFile) =>
            privateFile.toObject({ getters: true })
        ),
    });
};

const getPrivateFileByID = async(req, res, next) => {
    const privateFileID = req.params.privateFileID;
    const privateFile = await PrivateFile.findById(privateFileID);
    if (!privateFile) {
        console.log(err);
        return next(
            new HttpError("Could not find a private file for this id.", 404)
        );
    }
    res.json({ privateFile: privateFile });
};

const deletePrivateFileByID = async(req, res, next) => {
    const privateFileID = req.params.privateFileID;
    const privateFile = await PrivateFile.findById(privateFileID).populate(
        "user"
    );

    if (!privateFile) {
        console.log(err);
        return next(
            new HttpError("Could not find a private file for this id.", 404)
        );
    }

    let user;
    try {
        user = await User.findById(privateFile.user);
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Something went wrong, could not get the user.", 500)
        );
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await privateFile.remove({ session: sess });
        await user.privateFiles.pull(privateFile);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Something went wrong, could not delete the file.", 500)
        );
    }

    res.status(200).json({
        message: "File deleted successfully!",
    });
};

const updateProfile = async(req, res, next) => {
    const userID = req.userData.userId;
    const user = await User.findById(userID);
    if (!user) {
        console.log(err);
        return next(
            new HttpError("Something went wrong could not get the specific user", 500)
        );
    }

    user.name = req.body.name;
    const { downLoadURL } = req.file;
    user.image = downLoadURL;
    user.phone = req.body.phone;
    user.address = req.body.address;
    user.bio = req.body.bio;

    try {
        await user.save();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Something went wrong, could not update the user.", 500)
        );
    }

    res.status(200).json({
        message: "User Info updated successfully!",
        user: user,
    });
};

const changePassword = async(req, res, next) => {
    const userID = req.userData.userId;
    const user = await User.findById(userID);
    if (!user) {
        console.log(err);
        return next(
            new HttpError("Something went wrong could not get the specific user", 500)
        );
    }

    const isValidOldPassword = await bcrypt.compare(
        req.body.oldPassword,
        user.password

    );

    if (!isValidOldPassword) {
        return next(
            new HttpError("Old password is incorrect.", 403)
        );
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(req.body.newPassword, 12);
    } catch (err) {
        const error = new HttpError(
            "Could not create user, please try again.",
            500
        );
        return next(error);

    }

    user.password = hashedPassword;

    try {
        await user.save();
    } catch (err) {
        const error = new HttpError(
            "Chaning password, please try again.",
            500
        );
        console.log(err);
        return next(error);
    }

    res.status(200).json({
        message: "Password changed successfully!",
        user: user,
    });

}

const userPostinForum = async(req, res, next) => {
    const courseID = req.params.courseID;
    const userID = req.userData.userId;
    const user = await User.findById(userID);

    // now check if that course has that user in the participants list

    let course;

    try {
        course = await Course.findById(courseID);
    } catch (err) {
        const error = new HttpError(
            "Couldn't find the course",
            500
        );
        console.log(err);
        return next(error);
    }
    // if course.particpants has that user
    const coursesOfUser = await User.find({
        participants: userID
    });

    if (coursesOfUser.length > 0) {
        return next(
            new HttpError("You are already in this course", 403)
        );
    }

    const forum = await Forum.findById(course.forum);

    if (!forum) {
        return next(
            new HttpError("Could not find the forum for this course.", 404)
        );
    }

    const post = new ForumPost({
        user: user,
        forum: forum,
        postDescription: req.body.postDescription,
        postDate: new Date(),
    });

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await post.save({ session: session });
        await forum.posts.push(post);
        await forum.save({ session: session });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Could not create the post, please try again.", 500)
        );
    }

    res.status(200).json({
        message: "Post created successfully!",
        post: post,
    });
};

const getForumPosts = async(req, res, next) => {
    const courseID = req.params.courseID;

    const forum = await Forum.findOne({ course: courseID });
    if (!forum) {
        console.log(err);
        return next(
            new HttpError("Could not find the forum for this course.", 404)
        );
    }

    let posts;
    try {
        posts = await ForumPost.find({ forum: forum._id }).populate("user");
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Could not get the posts for this forum.", 500)
        );
    }

    res.status(200).json({
        message: "Posts fetched successfully!",
        posts: posts,
    });
};

const getForumPost = async(req, res, next) => {
    const postID = req.params.postID;

    let post;
    try {
        post = await ForumPost.findById(postID).populate("user");
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Could not get the post for this forum.", 500)
        );
    }

    res.status(200).json({
        message: "Post fetched successfully!",
        post: post,
    });
};

const replyToForumPost = async(req, res, next) => {
    const postID = req.params.postID;
    const userID = req.userData.userId;
    const user = await User.findById(userID);

    let post;
    try {
        post = await ForumPost.findById(postID);
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Could not get the post for this forum.", 500)
        );
    }

    const reply = new PostReply({
        replyDescription: req.body.replyDescription,
        replyDate: new Date(),
        user: user,
        post: post,
    });

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await reply.save({ session: session });
        await post.replies.push(reply);
        await post.save({ session: session });
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Could not create the reply, please try again.", 500)
        );
    }

    res.status(200).json({
        message: "Reply created successfully!",
        reply: reply,
    });
};

const getRepliesOfForumPost = async(req, res, next) => {
    const postID = req.params.postID;

    let post;
    try {
        post = await ForumPost.findById(postID);
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Could not get the post for this forum.", 500)
        );
    }

    let replies;
    try {
        replies = await PostReply.find({ post: post._id }).populate("user");
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Could not get the replies for this post.", 500)
        );
    }

    res.status(200).json({
        message: "Replies fetched successfully!",
        replies: replies,
    });
};

const deleteForumPost = async(req, res, next) => {

    const postID = req.params.postID;

    let post;
    try {
        post = await ForumPost.findById(postID);
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Could not get the post for this forum.", 500)
        );
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await post.remove({ session: session });
        //also need to delete the replies
        for (reply in post.replies) {
            await PostReply.findByIdAndRemove(reply, { session: session });
        }
        const forumRelatedtoPost = await Forum.findById(post.forum);
        await forumRelatedtoPost.posts.pull(post);
        await forumRelatedtoPost.save({ session: session });
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Could not delete the post, please try again.", 500)
        );
    }

    res.status(200).json({
        message: "Post deleted successfully!",
    });

};

const deleteReplyOfForumPost = async(req, res, next) => {
    const replyID = req.params.replyID;

    let reply;
    try {
        reply = await PostReply.findById(replyID);
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Could not get the reply for this post.", 500)
        );
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await reply.remove({ session: session });
        const postRelatedtoReply = await ForumPost.findById(reply.post);
        await postRelatedtoReply.replies.pull(reply);
        await postRelatedtoReply.save({ session: session });
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Could not delete the reply, please try again.", 500)
        );
    }

    res.status(200).json({
        message: "Reply deleted successfully!",
    });
};

const editPost = async(req, res, next) => {
    const postID = req.params.postID;

    let post;
    try {
        post = await ForumPost.findById(postID);
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Could not get the post for this forum.", 500)
        );
    }

    post.postDescription = req.body.postDescription;
    post.postDate = new Date();

    try {
        await post.save();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Could not edit the post, please try again.", 500)
        );
    }

    res.status(200).json({

        message: "Post edited successfully!",
        post: post,

    });
};

const editReply = async(req, res, next) => {

    const replyID = req.params.replyID;

    let reply;
    try {
        reply = await PostReply.findById(replyID);
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Could not get the reply for this post.", 500)
        );
    }

    reply.replyDescription = req.body.replyDescription;
    reply.replyDate = new Date();

    try {
        await reply.save();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Could not edit the reply, please try again.", 500)
        );
    }

    res.status(200).json({

        message: "Reply edited successfully!",
        reply: reply,

    });

};





exports.getUserById = getUserById;
exports.login = login;
exports.getCoursesByUserId = getCoursesByUserId;
exports.uploadPrivateFiles = uploadPrivateFiles;
exports.getAllPrivateFiles = getAllPrivateFiles;
exports.getPrivateFileByID = getPrivateFileByID;
exports.deletePrivateFileByID = deletePrivateFileByID;
exports.updateProfile = updateProfile;
exports.changePassword = changePassword;
exports.userPostinForum = userPostinForum;
exports.getForumPosts = getForumPosts;
exports.getForumPost = getForumPost;
exports.replyToForumPost = replyToForumPost;
exports.getRepliesOfForumPost = getRepliesOfForumPost;
exports.deleteForumPost = deleteForumPost;
exports.deleteReplyOfForumPost = deleteReplyOfForumPost;
exports.editPost = editPost;
exports.editReply = editReply;