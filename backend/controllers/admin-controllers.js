const uuid = require("uuid/v4"); // this is to generate unique id
const { validationResult } = require("express-validator"); //this one is to validate the inputs
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Course = require("../models/courses");
const User = require("../models/users");

//const DUMMY_COURSES = require("./course-controllers").DUMMY_COURSES; // this is to get the dummy courses from the course-controllers.js

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

    if (participants.length > 0) {
        try {
            user = await User.findById(participants);
        } catch (err) {
            const error = new HttpError(
                "Something went wrong, could not find user.",
                500
            );
            return next(error);
        }

        if (!user) {
            const error = new HttpError("Could not find user for provided id.", 404);
            return next(error);
        }
    }

    const createdCourse = await Course.create({
        sessionID,
        courseID,
        courseTitle,
        courseDescription,
        courseCreditHour,
        startDate,
        endDate,
        participants,
    });

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await createdCourse.save({ session: session });

        for await (const id of participants) {
            const userRelatedToCourse = await User.findById(id);
            userRelatedToCourse.courses.push(createdCourse);
            await userRelatedToCourse.save({ session: session });
            console.log(userRelatedToCourse.moodleID);
        }

        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Creating course failed, please try again.",
            500
        );
        console.log(err);
        return next(error);
    }

    // res.status(201).json({ message: "Course created successfully." });
    res.json({ message: "Course created successfully." });
};

const adminEditCourse = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError("Invalid inputs passed, please check your data.", 422);
    }

    const { courseId, participants } = req.body;
    const cid = req.params.courseID;

    let course;
    try {
        course = await Course.findById(cid);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find course.",
            500
        );
        return next(error);
    }

    if (!course) {
        const error = new HttpError("Could not find course for provided id.", 404);

        return next(error);
    }

    let user;
    if (participants.length > 0) {
        try {
            user = await User.findById(participants);
        } catch (err) {
            const error = new HttpError(
                "Something went wrong, could not find user.",
                500
            );
            return next(error);
        }

        if (!user) {
            const error = new HttpError("Could not find user for provided id.", 404);
            return next(error);
        }
    }

    course.participants.push(participants);

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await course.save({ session: session });

        for await (const id of participants) {
            const userRelatedToCourse = await User.findById(id);
            userRelatedToCourse.courses.push(course);
            await userRelatedToCourse.save({ session: session });
            console.log(userRelatedToCourse.moodleID);
        }

        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Updating course failed, please try again.",
            500
        );
        console.log(err);
        return next(error);
    }

    // res.status(200).json({ course: updatedCourse });
    res.json({ course: course });
};

const adminRemovesFromCourse = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError("Invalid inputs passed, please check your data.", 422);
    }

    const { participants } = req.body;
    const cid = req.params.courseID;

    let course;
    try {
        course = await Course.findById(cid);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find course.",
            500
        );
        return next(error);
    }

    if (!course) {
        const error = new HttpError("Could not find course for provided id.", 404);

        return next(error);
    }

    let user;
    if (participants.length > 0) {
        try {
            user = await User.findById(participants);
        } catch (err) {
            const error = new HttpError(
                "Something went wrong, could not find user.",
                500
            );
            return next(error);
        }

        if (!user) {
            const error = new HttpError("Could not find user for provided id.", 404);
            return next(error);
        }
    }



    try {
        course.participants.pull(participants);
        const session = await mongoose.startSession();
        session.startTransaction();
        await course.save({ session: session });
        user.courses.pull(course);
        await user.save({ session: session });
        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Deleting from course failed, please try again.",
            500
        );
        console.log(err);
        return next(error);
    }

    res.json({ course: course });
};


const adminDeleteCourse = async(req, res, next) => {
    const courseID = req.params.courseID;
    let course;
    try {
        course = await Course.findById(courseID).populate("participants");
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find course.",
            500
        );
        return next(error);
    }
    if (!course) {
        const error = new HttpError("Could not find course for provided id.", 404);
        return next(error);
    }
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await course.remove({ session: session });
        for await (const user of course.participants) {
            user.courses.pull(course);
            await user.save({ session: session });
        }
        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete course.",
            500
        );
        return next(error);
    }

    res.status(200).json({ message: "Course deleted successfully." });
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
        const error = new HttpError("Could not find courses.", 404);
        return next(error);
    }
    res.json({ courses: courses });
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
        courses,
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
        courses,
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

const getUsersList = async(req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        const error = new HttpError(
            "Failed to fetch users, please try again.",
            500
        );
        return next(error);
    }
    if (!users) {
        const error = new HttpError("Could not find users.", 404);
        return next(error);
    }
    res.json({ users: users });
    // res.json({ message: "Get all users!" });
};

const adminEditUser = (req, res, next) => {};

const adminDeleteUser = async(req, res, next) => {
    // const courseID = req.params.courseID;
    const userID = req.params.userID;
    // let course;
    let user;
    try {
        // course = await Course.findById(courseID).populate("participants");
        user = await User.findById(userID).populate("courses");
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find course.",
            500
        );
        return next(error);
    }
    if (!user) {
        const error = new HttpError("Could not find user for provided id.", 404);
        return next(error);
    }
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await user.remove({ session: session });
        for await (const course of user.courses) {
            course.participants.pull(user);
            await course.save({ session: session });
        }
        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete course.",
            500
        );
        return next(error);
    }

    res.status(200).json({ message: "User deleted successfully." });
};

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
exports.adminRemovesFromCourse = adminRemovesFromCourse;