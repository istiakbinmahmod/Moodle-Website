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

router.use(checkAuth);

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

const userEditProfile = async(req, res, next) => {
    const userID = req.params.uid;

    const user = await User.findById(userID);
    if (!user) {
        console.log(err);
        return next(
            new HttpError("Something went wrong could not get the specific user", 500)
        );
    }
};

exports.getUserById = getUserById;
exports.login = login;
exports.getCoursesByUserId = getCoursesByUserId;
exports.userEditProfile = userEditProfile;