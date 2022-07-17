const HttpError = require('../models/http-error');
const { validationResult } = require("express-validator"); //this one is to validate the inputs
const mongoose = require("mongoose");
const Course = require("../models/courses");
const User = require("../models/users");

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
    let existingUser;
    try {
        existingUser = await User.findOne({ moodleID: moodleID });

    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong, could not login.', 500));
    }
    if (!existingUser || existingUser.password !== password) {
        return next(new HttpError('Could not login, wrong credentials.', 401));
    }

    res.json({ message: 'Logged in!' });
};

const getCoursesByUserId = async(req, res, next) => {
    const userId = req.params.uid;
    const user = await User.findById(userId);
    if (!user) {
        console.log(err);
        return next(new HttpError('Could not find a user for this id.', 404));
        //throw new HttpError("Could not find a user for this id.", 404);
    }
    // let coursesOfUser = [];
    // for (let i = 0; i < user.courses.length; i++) {
    //     const course = await Course.findById(user.courses[i]);
    //     if (!course) {
    //         console.log(err);
    //         return next(new HttpError('Could not find a course for this id.', 404));
    //         // throw new HttpError("Could not find a course for this id.", 404);
    //     }
    //     coursesOfUser.push(course);
    // }
    // res.json({ coursesOfUser });
    let coursesOfUser;
    try {
        coursesOfUser = await User.findById(userId).populate('courses');
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong, could not get courses.', 500));
    }
    if (!coursesOfUser || coursesOfUser.length === 0) {
        return next(new HttpError('Could not get courses, no courses found.', 404));
    }
    res.json({ courses: coursesOfUser.courses.map(course => course.toObject({ getters: true })) });
}


exports.getUserById = getUserById;
exports.login = login;
exports.getCoursesByUserId = getCoursesByUserId;