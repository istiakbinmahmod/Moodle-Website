const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator"); //this one is to validate the inputs
const mongoose = require("mongoose");
const Course = require("../models/courses");
const User = require("../models/users");
const Session = require("../models/sessions");

const getCoursesList = async(req, res, next) => {
    const courses = await Course.find();

    res.json({
        courses: courses.map((course) => course.toObject({ getters: true })),
    });
};

const getCourseById = (req, res, next) => {
    const courseId = req.params.courseID;
    Course.findById(courseId)
        .then((course) => {
            if (!course) {
                throw new HttpError("Could not find a course for this id.", 404);
            }
            res.json({ course: course.toObject({ getters: true }) });
        })
        .catch((err) => {
            console.log(err);
            next(
                new HttpError(
                    "Something went wrong, could not find a course for this id.",
                    500
                )
            );
        });
};

const getUsersByCourseId = async(req, res, next) => {
    const courseId = req.params.courseID;
    const course = await Course.findById(courseId);
    if (!course) {
        console.log(err);
        return next(new HttpError("Could not find a course for this id.", 404));
    }
    let usersOfCourse;
    try {
        usersOfCourse = await Course.findById(courseId).populate("participants");
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Something went wrong, could not get users.", 500)
        );
    }
    if (!usersOfCourse || usersOfCourse.length === 0) {
        return next(new HttpError("Could not get users, no users found.", 404));
    }
    res.json({
        users: usersOfCourse.participants.map((user) =>
            user.toObject({ getters: true })
        ),
    });
};

const getCourseBySessionID = async(req, res, next) => {
    const sessionID = req.params.sessionID;
    const session = await Session.findById(sessionID);
    if (!session) {
        console.log(err);
        return next(new HttpError("Could not find a session for this id.", 404));
    }
    let courseOfSession;
    try {
        courseOfSession = await Session.findById(sessionID).populate("courses");
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Something went wrong, could not get course.", 500)
        );
    }
    if (!courseOfSession || courseOfSession.length === 0) {
        return next(new HttpError("Could not get course, no course found.", 404));
    }
    res.json({ courses: courseOfSession.courses.toObject({ getters: true }) });
};

exports.getCourseById = getCourseById;
exports.getCoursesList = getCoursesList;
exports.getUsersByCourseId = getUsersByCourseId;
exports.getCourseBySessionID = getCourseBySessionID;