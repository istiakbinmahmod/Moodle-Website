const uuid = require('uuid/v4'); // this is to generate unique id
const { validationResult } = require('express-validator'); //this one is to validate the inputs

const HttpError = require('../models/http-error');

const DUMMY_COURSES = require('./course-controllers').DUMMY_COURSES; // this is to get the dummy courses from the course-controllers.js



//this one is to create a dummy admin, we will create a new admin in mongoDB later
const DUMMY_ADMIN = [{
    id: 'a1',
    name: 'Max Schwarz',
    email: 'test@test.com',
    password: 'testers'
}];

//this one is to get all admins
const getAdmin = (req, res, next) => {
    res.json({ admin: DUMMY_ADMIN });
}

//this one is to login the admin
const adminLogin = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedAdmin = DUMMY_ADMIN.find(admin => admin.email === email); //this one is to find the admin with the email
    if (!identifiedUser || identifiedUser.password !== password) { //this one is to check if the password is correct
        throw new HttpError('Could not identify admin, credentials seem to be wrong.', 401); //this one is to throw an error if the password is wrong
    }

    res.json({ message: 'Logged in!' }); //this one is to send a message if login is successful
};


const adminCreateCourse = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }

    const { courseID, courseTitle, courseCreditHour, courseDescription } = req.body;

    const createdCourse = {
        courseID,
        courseTitle,
        courseCreditHour,
        courseDescription
    };

    DUMMY_COURSES.push(createdCourse); //unshift(createdPlace)

    res.status(201).json({ course: createdCourse });
};



const adminEditCourse = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }

    const { sessionID, courseID, courseTitle, courseCreditHour, courseDescription } = req.body;
    const cid = req.params.courseID;

    const updatedCourse = {...DUMMY_COURSES.find(c => c.courseID === cid) };
    const courseIndex = DUMMY_COURSES.findIndex(c => c.courseID === cid);
    updatedCourse.courseTitle = courseTitle;
    updatedCourse.courseCreditHour = courseCreditHour;
    updatedCourse.courseDescription = courseDescription;

    DUMMY_COURSES[courseIndex] = updatedCourse;

    res.status(200).json({ course: updatedCourse });

}



const adminDeleteCourse = (req, res, next) => {
    const courseID = req.body;
    if (!DUMMY_COURSES.find(c => c.courseID === courseID)) {
        throw new HttpError('Could not find a course for that id.', 404);
    }
    DUMMY_COURSES = DUMMY_COURSES.filter(c => c.courseID !== courseID);
    res.status(200).json({ message: 'Deleted course.' });
}

const getCoursesList = (req, res, next) => {
    res.json({ message: 'Get all courses!' });
}



const adminCreateSession = (req, res, next) => {
    const { sessionID, courseID, sessionTitle, sessionDate, sessionTime, } = req.body;
}

const adminDeleteSession = (req, res, next) => {
    const { sessionID } = req.body;
}





exports.getAdmin = getAdmin;
exports.adminLogin = adminLogin;
exports.getCoursesList = getCoursesList;
exports.adminCreateCourse = adminCreateCourse;
exports.adminCreateSession = adminCreateSession;
exports.adminDeleteCourse = adminDeleteCourse;
exports.adminDeleteSession = adminDeleteSession;
exports.adminEditCourse = adminEditCourse;