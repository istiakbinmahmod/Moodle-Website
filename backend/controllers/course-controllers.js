// const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');



let DUMMY_COURSES = [{
    sessionID: 'jan2020',
    courseID: 'CSE408',
    courseTitle: 'Software Engineering',
    courseDescription: 'This course is about software engineering.',
    courseCreditHour: 3
        // courseSession: [{
        //     sessionID: 'jan2020',
        //     sessionTitle: 'Session 1',
        //     sessionDate: '01/01/2020',
        //     sessionTime: '09:00',
        //     sessionPlace: 'p1'
        // }]
}];

// const sendCourseList = (req, res, next) => {
//     return DUMMY_COURSES;
// }

const getCoursesList = (req, res, next) => {
    res.json({ courses: DUMMY_COURSES });
}

const getCourseById = (req, res, next) => {
    const courseId = req.params.courseID;

    const course = DUMMY_COURSES.find(c => { // this is to find the course with the courseID
        return c.courseID === courseId;
    });

    if (!course) {
        throw new HttpError('Could not find a course for the provided id.', 404);
    }

    res.json({ course }); // => { course } => { course: course }
}

exports.getCourseById = getCourseById;
exports.getCoursesList = getCoursesList;
// exports.sendCourseList = sendCourseList;
// exports.DUMMY_COURSES = DUMMY_COURSES;