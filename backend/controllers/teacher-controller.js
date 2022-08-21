const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator"); //this one is to validate the inputs
const mongoose = require("mongoose");
const Course = require("../models/courses");
const CourseMaterials = require("../models/course_materials");
const Assignment = require("../models/assignment");

const Submission = require("../models/submissions");
const storage = require("../firebase");
const User = require("../models/users");
const Notification = require("../models/notifications");

const getCourseMaterials = async(req, res, next) => {
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

const deleteCourseMaterials = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const courseMaterialsId = req.body.courseMaterialsId;
    console.log(courseMaterialsId);
    const cid = req.params.courseID;
    console.log(cid);

    const course = await Course.findById(cid);

    if (!course) {
        const error = new HttpError(
            "Could not find course for this course id.",
            404
        );
        return next(error);
    }

    let courseMaterial;

    try {
        courseMaterial = await CourseMaterials.findById(courseMaterialsId).populate(
            "course"
        );
        // await course.courseMaterials.pull(courseMaterial);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete course materials.",
            500
        );
        return next(error);
    }

    if (!courseMaterial) {
        const error = new HttpError(
            "Could not find course materials for this course id.",
            404
        );
        return next(error);
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await courseMaterial.remove({ session: session });
        await course.courseMaterials.pull(courseMaterial);
        await course.save({ session: session });
        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete course materials.",
            500
        );
        return next(error);
    }

    res
        .status(200)
        .json({ message: "Deleted course materials.", course: course });
};

const uploadCourseAssignment = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }
    const { downloadURL } = req.file;
    console.log(downloadURL);

    const courseId = req.params.courseID;

    let createdAssignment;

    createdAssignment = new Assignment({
        file: downloadURL,
        course: courseId,
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        cutOffDate: req.body.cutOffDate,
        marks: req.body.marks,
        is_active: req.body.is_active,
        created_at: new Date(),
    });

    const relatedCourse = await Course.findById(courseId);
    if (!relatedCourse) {
        return next(new HttpError("Could not find a course for this id.", 404));
    }

    try {
        await createdAssignment.save();
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdAssignment.save({ session: sess });
        await relatedCourse.courseAssignments.push(createdAssignment);
        await relatedCourse.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Something went wrong, could not upload assignment.", 500)
        );
    }

    const createdNotification = new Notification({
        user: relatedCourse.teacher,
        title: `New assignment has been uploaded for ${relatedCourse.courseTitle}`,
        date: new Date(),
        course : relatedCourse,

    });

    let courseParticipants;
    courseParticipants = await User.find({ course: courseId });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdNotification.save({ session: sess });
        for(let i = 0; i < courseParticipants.length; i++){
            await courseParticipants[i].notifications.push(createdNotification);
            await courseParticipants[i].save({ session: sess });
        }
        await sess.commitTransaction();
    }
    catch (err) {
        const error = new HttpError(
            "Something went wrong, could not create notification.",
            500
        );
        return next(error);
    }


    res.json({ assignment: createdAssignment });
};

const updateCourseAssignment = async(req, res, next) => {
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

    assignment.title = req.body.title;
    assignment.description = req.body.description;
    assignment.dueDate = req.body.dueDate;
    assignment.cutOffDate = req.body.cutOffDate;
    assignment.marks = req.body.marks;
    assignment.is_active = req.body.is_active;
    assignment.is_updated = true;
    assignment.updated_at = new Date();

    try {
        await assignment.save();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Something went wrong, could not update assignment.", 500)
        );
    }

    res.json({ assignment: assignment });
};

const getAllCourseAssignments = async(req, res, next) => {
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

const getCourseAssignmentByAssignmentD = async(req, res, next) => {
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

const deleteCourseAssignment = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const assignmentId = req.body.assignmentId;
    const courseId = req.params.courseID;

    let course;
    try {
        course = await Course.findById(courseId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find course.",
            500
        );
        return next(error);
    }
    if (!course) {
        const error = new HttpError(
            "Could not find course for this course id.",
            404
        );
        return next(error);
    }

    let assignment;

    try {
        assignment = await Assignment.findById(assignmentId).populate("course");
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

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await assignment.remove({ session: sess });
        await course.courseAssignments.pull(assignment);
        await course.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Something went wrong, could not delete assignment.", 500)
        );
    }

    res.json({ message: "Assignment deleted successfully.", course: course });
};

// the teacher should be able to view  and download the submissions of the students for a specific course assignment

// the teacher should be able to view the submissions and download of the students for a specific course assignment for a specific student

//the teacher should be able to open a forum post for a specific course

//  the teacher can have some private files

const uploadCourseMaterials = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const { downloadURL } = req.file;
    console.log(downloadURL);

    let createdCourseMaterials;
    let courseId = req.params.courseID;

    courseId = req.params.courseID;

    createdCourseMaterials = new CourseMaterials({
        file: downloadURL,
        course: courseId,
        title: req.body.title,
    });

    const relatedCourse = await Course.findById(courseId);
    console.log(relatedCourse.courseID);
    if (!relatedCourse) {
        return next(new HttpError("Could not find a course for this id.", 404));
    }

    try {
        await createdCourseMaterials.save();
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdCourseMaterials.save({ session: sess });
        await relatedCourse.courseMaterials.push(createdCourseMaterials);
        await relatedCourse.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError(
                "Something went wrong, could not upload course materials.",
                500
            )
        );
    }

    res.json({ courseMaterials: createdCourseMaterials });
};

const getAllSubmissionsForAssignment = async(req, res, next) => {

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

    let submissions;
    try {
        submissions = await Submission.find({ assignment: assignmentId });
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find submissions.",
            500
        );
        return next(error);
    }
    if (!submissions) {

        const error = new HttpError(
            "Could not find submissions for this assignment id.",
            404
        );
        return next(error);
    }

    res.json({ submissions: submissions });

};

const markSubmissionForAssignment = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const { grade, comments } = req.body;
    const submissionId = req.params.submissionID;
    let submission;
    try {
        submission = await Submission.findById(submissionId);
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
    submission.grade = grade;
    submission.comments = comments;
    submission.is_graded = true;

    try {
        await submission.save();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not update submission.",
            500
        );
        return next(error);
    }

    res.json({ submission: submission });
}

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










exports.uploadCourseMaterials = uploadCourseMaterials;
exports.getCourseMaterials = getCourseMaterials;
exports.deleteCourseMaterials = deleteCourseMaterials;

exports.uploadCourseAssignment = uploadCourseAssignment;
exports.updateCourseAssignment = updateCourseAssignment;
exports.getAllCourseAssignments = getAllCourseAssignments;
exports.getCourseAssignmentByAssignmentD = getCourseAssignmentByAssignmentD;
exports.deleteCourseAssignment = deleteCourseAssignment;

exports.getAllSubmissionsForAssignment = getAllSubmissionsForAssignment;
exports.markSubmissionForAssignment = markSubmissionForAssignment;

exports.getEnrolledCourses = getEnrolledCourses;