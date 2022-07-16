const uuid = require("uuid/v4"); // this is to generate unique id
const { validationResult } = require("express-validator"); //this one is to validate the inputs
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Course = require("../models/courses");
const User = require("../models/users");

const DUMMY_COURSES = require("./course-controllers").DUMMY_COURSES; // this is to get the dummy courses from the course-controllers.js

//this one is to create a dummy admin, we will create a new admin in mongoDB later
const DUMMY_ADMIN = [{
    id: "a1",
    name: "Max Schwarz",
    email: "test@test.com",
    password: "testers",
}, ];

//this one is to get all admins
const getAdmin = (req, res, next) => {
    res.json({ admin: DUMMY_ADMIN });
};

//this one is to login the admin
const adminLogin = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedAdmin = DUMMY_ADMIN.find((admin) => admin.email === email); //this one is to find the admin with the email
    if (!identifiedUser || identifiedUser.password !== password) {
        //this one is to check if the password is correct
        throw new HttpError(
            "Could not identify admin, credentials seem to be wrong.",
            401
        ); //this one is to throw an error if the password is wrong
    }

    res.json({ message: "Logged in!" }); //this one is to send a message if login is successful
};

const adminCreateCourse = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const {
        sessionID,
        courseID,
        courseTitle,
        courseDescription,
        courseCreditHour,
        startDate,
        endDate,
        participants,
    } = req.body;

    let user;

    try {
        // user = await User.findOne({ moodleID: participants });
        // user.map((u) => u.moodleID === participants);
        user = await User.findById(participants);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find user.",
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            "Could not find user for provided id.",
            404
        );
        return next(error);
    }

    const createdCourse = new Course({
        sessionID,
        courseID,
        courseTitle,
        courseDescription,
        courseCreditHour,
        startDate,
        endDate,
        user
    });


    try {
        // await createdCourse.save();
        const session = await mongoose.startSession();
        session.startTransaction();
        await createdCourse.save({ session: session });
        user.courses.push(createdCourse);
        await user.save({ session: session });
        await session.commitTransaction();

    } catch (err) {
        const error = new HttpError(
            "Creating course failed, please try again.",
            500
        );
        console.log(err);
        return next(error);
    }

    res.status(201).json({ course: createdCourse });
};

const adminEditCourse = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError("Invalid inputs passed, please check your data.", 422);
    }

    const {
        sessionID,
        courseID,
        courseTitle,
        courseCreditHour,
        courseDescription,
    } = req.body;
    const cid = req.params.courseID;

    const updatedCourse = {...DUMMY_COURSES.find((c) => c.courseID === cid) };
    const courseIndex = DUMMY_COURSES.findIndex((c) => c.courseID === cid);
    updatedCourse.courseTitle = courseTitle;
    updatedCourse.courseCreditHour = courseCreditHour;
    updatedCourse.courseDescription = courseDescription;

    DUMMY_COURSES[courseIndex] = updatedCourse;

    res.status(200).json({ course: updatedCourse });
};

const adminDeleteCourse = (req, res, next) => {
    const courseID = req.body;
    if (!DUMMY_COURSES.find((c) => c.courseID === courseID)) {
        throw new HttpError("Could not find a course for that id.", 404);
    }
    DUMMY_COURSES = DUMMY_COURSES.filter((c) => c.courseID !== courseID);
    res.status(200).json({ message: "Deleted course." });
};

const getCoursesList = async(req, res, next) => {
    let courses;
    try {
        courses = await Course.find();
    } catch (err) {
        const error = new HttpError(
            "Failed to fetch courses, please try again.",
            500
        );
        return next(error);
    }
    if (!courses) {
        const error = new HttpError(
            "Could not find courses.",
            404
        );
        return next(error);
    }
    res.json({ courses });
    // res.json({ message: "Get all courses!" });
};

const adminCreateUser = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError("Invalid inputs passed, please check your data.", 422);
    }

    const {
        moodleID,
        name,
        email,
        password,
        image,
        phone,
        address,
        accessTime,
        role,
        courses
    } = req.body;

    const createdUser = new User({
        moodleID,
        name,
        email,
        password,
        image,
        phone,
        address,
        accessTime,
        role,
        courses
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError("Creating user failed, please try again.", 500);
        console.log(err);
        return next(error);
    }

    res.status(201).json({ user: createdUser });
};

const getUsersList = (req, res, next) => {};

const adminEditUser = (req, res, next) => {};

const adminDeleteUser = (req, res, next) => {};

exports.getAdmin = getAdmin;
exports.adminLogin = adminLogin;
exports.getCoursesList = getCoursesList;
exports.adminCreateCourse = adminCreateCourse;
exports.adminDeleteCourse = adminDeleteCourse;
exports.adminEditCourse = adminEditCourse;
exports.adminCreateUser = adminCreateUser;
exports.getUsersList = getUsersList;
exports.adminEditUser = adminEditUser;
exports.adminDeleteUser = adminDeleteUser;