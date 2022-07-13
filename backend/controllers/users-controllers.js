// const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [{
    id: 'u1',
    name: 'student',
    email: 'teststudent@test.com',
    password: 'studentTester1',
    role: 'student'
}];

const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
};


const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
    }

    res.json({ message: 'Logged in!' });
};

const getCoursesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const user = DUMMY_USERS.find(u => u.id === userId);
    if (!user) {
        throw new HttpError('Could not find user for this id.', 404);
    }
    res.json({ courses: user.courses });
}


exports.getUsers = getUsers;
exports.login = login;
exports.getCoursesByUserId = getCoursesByUserId;