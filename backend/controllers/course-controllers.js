const HttpError = require('../models/http-error');
const { validationResult } = require("express-validator"); //this one is to validate the inputs
const mongoose = require("mongoose");
const Course = require("../models/courses");
const User = require("../models/users");

const getCoursesList = async(req, res, next) => {
    const courses = await Course.find();

    res.json({ courses });
}

const getCourseById = (req, res, next) => {
    const courseId = req.params.courseID;
    Course.findById(courseId)
        .then(course => {
            if (!course) {
                throw new HttpError("Could not find a course for this id.", 404);
            }
            res.json({ course: course.toObject({ getters: true }) });
        }).catch(err => {
            console.log(err);
            next(new HttpError("Something went wrong, could not find a course for this id.", 500));
        });
};

const getUsersByCourseId = async(req, res, next) => {
    const courseId = req.params.courseID;
    const course = await Course.findById(courseId);
    if (!course) {
        console.log(err);
        return next(new HttpError("Could not find a course for this id.", 404));
    }
    let usersOfCourse = [];
    for (let i = 0; i < course.users.length; i++) {
        const user = await User.findById(course.users[i]);
        if (!user) {
            console.log(err);
            return next(new HttpError("Could not find a user for this id.", 404));
        }
        usersOfCourse.push(user);
    }
    res.json({ usersOfCourse });

}

exports.getCourseById = getCourseById;
exports.getCoursesList = getCoursesList;
exports.getUsersByCourseId = getUsersByCourseId;