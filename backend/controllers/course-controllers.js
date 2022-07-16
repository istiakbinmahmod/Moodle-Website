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

exports.getCourseById = getCourseById;
exports.getCoursesList = getCoursesList;