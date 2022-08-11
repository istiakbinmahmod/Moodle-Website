const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator"); //this one is to validate the inputs
const mongoose = require("mongoose");
const Course = require("../models/courses");
const CourseMaterials = require("../models/course_materials");


const uploadCourseMaterials = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    if (req.files === null) {
        return next(new HttpError("No file was uploaded", 422));
    }

    const courseId = req.params.courseID;

    const createdCourseMaterials = new CourseMaterials({
        file: req.file.path,
        course: courseId,
    });

    const relatedCourse = await Course.findById(courseId);
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

    const { courseMaterialsId } = req.body;
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

    let courseMaterial;

    try {
        courseMaterial = await CourseMaterials.findById(courseMaterialsId).populate('course');
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

    res.status(200).json({ message: "Deleted course materials.", course: course });





};

exports.uploadCourseMaterials = uploadCourseMaterials;
exports.getCourseMaterials = getCourseMaterials;
exports.deleteCourseMaterials = deleteCourseMaterials;