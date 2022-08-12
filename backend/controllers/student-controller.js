const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator"); //this one is to validate the inputs
const mongoose = require("mongoose");
const Course = require("../models/courses");
const CourseMaterials = require("../models/course_materials");
const Assignment = require("../models/assignment");
const Submissions = require("../models/submissions");
const User = require("../models/users");
const Student = require("../models/students");

const getAllCourses = async(req, res, next) => {
    let courses;
    try {
        courses = await Course.find({});
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find courses.",
            500
        );
        return next(error);
    }

    if (!courses) {
        const error = new HttpError("Could not find courses for this user.", 404);
        return next(error);
    }

    res.json({ courses });
};

const getEnrolledCourses = async(req, res, next) => {
    const user = req.userData.userId;

    if (!user) {
        const error = new HttpError("Could not find user for this user id.", 404);
        return next(error);
    }

    let enrolledCourses;
    try {
        enrolledCourses = await User.findById(user).populate("courses");
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find courses.",
            500
        );
        return next(error);
    }

    if (!enrolledCourses) {
        const error = new HttpError("Could not find courses for this user.", 404);
        return next(error);
    }

    res.json({ courses: enrolledCourses.courses.toObject({ getters: true }) });
};

const getCourseMaterials = async(req, res, next) => { //get all course materials for a course
    const courseId = req.params.courseID;
    let courseMaterials;
    try {
        courseMaterials = await CourseMaterials.find({ course: courseId });
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find course materials.",
            500
        );
        return next(error);
    }

    if (!courseMaterials) {
        const error = new HttpError(
            "Could not find course materials for this course id.",
            404
        );
        return next(error);
    }

    res.json({ courseMaterials });
};

const uploadSubmission = async(req, res, next) => { //upload a submission for an assignment
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const assignmentId = req.params.assignmentID;

    let assignment;
    try {
        assignment = await Assignment.findById(assignmentId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find assignment.",
            500
        );
        return next(error);
    }

    if (!assignment) {
        const error = new HttpError(
            "Could not find assignment for this assignment id.",
            404
        );
        return next(error);
    }

    if (req.files === null) {
        return next(new HttpError("No file uploaded", 422));
    }

    const submission = new Submissions({
        file: req.file.path,
        assignment: assignmentId,
        user: req.userData.userId,
    });

    try {
        await submission.save();
        const session = await mongoose.startSession();
        session.startTransaction();
        await submission.save({ session: session });
        await assignment.submitted_assignments.push(submission);
        await assignment.save({ session: session });
        const uploader = await User.findById(req.userData.userId);
        const student = await Student.findOne({ user: uploader._id });
        await student.submitted_assignments.push(submission);
        await student.save({ session: session });
        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Creating submission failed, please try again.",
            500
        );
        return next(error);
    }

    res.status(201).json({ submission: submission });
};

const updateSubmission = async(req, res, next) => { //update a submission for an assignment
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const submissionId = req.params.submissionID;

    let submission;
    try {
        submission = await Submissions.findById(submissionId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find submission.",
            500
        );
        return next(error);
    }

    if (!submission) {
        const error = new HttpError(
            "Could not find submission for this submission id.",
            404
        );
        return next(error);
    }

    if (req.files === null) {
        return next(new HttpError("No file uploaded", 422));
    }

    submission.file = req.file.path;

    try {
        await submission.save();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not update submission.",
            500
        );
        return next(error);
    }

    res.status(200).json({ submission: submission });
};

const deleteSubmission = async(req, res, next) => { //delete a submission for an assignment
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const submissionId = req.params.submissionID;

    let submission;
    try {
        submission = await Submissions.findById(submissionId).populate(
            "assignment"
        );
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find submission.",
            500
        );
        return next(error);
    }

    if (!submission) {
        const error = new HttpError(
            "Could not find submission for this submission id.",
            404
        );
        return next(error);
    }

    let relatedAssignment;
    relatedAssignment = submission.assignment;
    let relatedStudent;
    relatedStudent = await Student.findOne({ user: submission.user });

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await submission.remove({ session: session });
        await relatedAssignment.submitted_assignments.pull(submission);
        await relatedAssignment.save({ session: session });
        await relatedStudent.submitted_assignments.pull(submission);
        await relatedStudent.save({ session: session });
        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete submission.",
            500
        );
        return next(error);
    }

    res.status(200).json({ message: "Deleted submission." });
};

const getAllCourseAssignments = async(req, res, next) => { //get all assignments for a course
    const courseId = req.params.courseID;

    let courseAssignments;
    try {
        courseAssignments = await Assignment.find({ course: courseId });
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find course assignments.",
            500
        );
        return next(error);
    }

    if (!courseAssignments) {
        const error = new HttpError(
            "Could not find course assignments for this course id.",
            404
        );
        return next(error);
    }

    res.json({ courseAssignments: courseAssignments });
};

const getCourseAssignmentByAssignmentD = async(req, res, next) => { //get all assignments for a course
    const assignmentId = req.params.assignmentID;

    let assignment;
    try {
        assignment = await Assignment.findById(assignmentId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find assignment.",
            500
        );
        return next(error);
    }

    if (!assignment) {
        const error = new HttpError(
            "Could not find assignment for this assignment id.",
            404
        );
        return next(error);
    }

    res.json({ assignment: assignment });
};

const getSubmissionByAssignmentID = async(req, res, next) => { //get my submission for an assignment id
    const assignmentId = req.params.assignmentID;

    let submission;
    try {
        submission = await Submissions.findOne({
            assignment: assignmentId,
            user: req.userData.userId,
        });
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find submission.",
            500
        );
        return next(error);
    }

    if (!submission) {
        const error = new HttpError(
            "Could not find submission for this submission id.",
            404
        );
        return next(error);
    }

    res.json({ submission: submission });
};



exports.getEnrolledCourses = getEnrolledCourses;
exports.getAllCourses = getAllCourses;
exports.getCourseMaterials = getCourseMaterials;
exports.getAllCourseAssignments = getAllCourseAssignments;
exports.getCourseAssignmentByAssignmentD = getCourseAssignmentByAssignmentD;
exports.uploadSubmission = uploadSubmission;
exports.updateSubmission = updateSubmission;
exports.deleteSubmission = deleteSubmission;
exports.getSubmissionByAssignmentID = getSubmissionByAssignmentID;