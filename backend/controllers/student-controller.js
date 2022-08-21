const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator"); //this one is to validate the inputs
const mongoose = require("mongoose");
const Course = require("../models/courses");
const CourseMaterials = require("../models/course_materials");
const Assignment = require("../models/assignment");
const Submissions = require("../models/submissions");
const User = require("../models/users");
const Student = require("../models/students");
const Notification = require("../models/notifications");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

const getAllCourses = async (req, res, next) => {
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

const getEnrolledCourses = async (req, res, next) => {
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

const getCourseMaterials = async (req, res, next) => {
  //get all course materials for a course
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

const uploadSubmission = async (req, res, next) => {
  //upload a submission for an assignment
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

  const { downloadURL } = req.file;
  console.log(downloadURL);

  const submission = new Submissions({
    file: downloadURL,
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

  let uploader = await User.findById(req.userData.userId);

  const createdNotification = new Notification({
    user: uploader,
    title: `${uploader.name} has submitted for ${assignment.title}`,
    date: new Date(),
    submission: submission,
    assignment: assignment,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdNotification.save({ session: session });
    await uploader.notifications.push(createdNotification);
    await uploader.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating notification failed, please try again.",
      500
    );
    return next(error);
  }

  transporter.sendMail({
    to: uploader.email,
    from: "no-reply@moodle.com",
    subject: "You have a new submission",
    text: `You have submitted for ${assignment.title} in ${assignment.course}`,
    html: `<p>You have submitted for ${assignment.title}</p>`,
  });

  res.status(201).json({ submission: submission });
};

const updateSubmission = async (req, res, next) => {
  //update a submission for an assignment
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const assignmentId = req.params.assignmentID;
  // const submissionId = req.params.submissionID;

  let submission;
  try {
    //submission = await Submissions.findById(submissionId);
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

  const { downloadURL } = req.file;
  console.log(downloadURL);

  submission.file = downloadURL;

  try {
    await submission.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update submission.",
      500
    );
    return next(error);
  }

  let uploader = await User.findById(req.userData.userId);
  let assignment = await Assignment.findById(assignmentId);

  const createdNotification = new Notification({
    user: uploader,
    title: `${uploader.name} has updated a submission for ${assignment.title}`,
    date: new Date(),
    submission: submission,
    assignment: assignment,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdNotification.save({ session: session });
    await uploader.notifications.push(createdNotification);
    await uploader.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating notification failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(200).json({ submission: submission });
};

const deleteSubmission = async (req, res, next) => {
  //delete a submission for an assignment
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const submissionId = req.params.submissionID;
  const assignmentId = req.params.assignmentID;

  let submission;
  try {
    // submission = await Submissions.findById(submissionId).populate(
    //   "assignment"
    // );

    submission = await Submissions.findOne({
      assignment: assignmentId,
      user: req.userData.userId,
    }).populate("assignment");
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
  let uploader = await User.findById(req.userData.userId);
  const createdNotification = new Notification({
    user: uploader,
    title: `${uploader.name} has deleted submission for ${relatedAssignment.title}`,
    date: new Date(),
    submission: submission,
    assignment: relatedAssignment,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdNotification.save({ session: session });
    await uploader.notifications.push(createdNotification);
    await uploader.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating notification failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted submission." });
};

const getAllCourseAssignments = async (req, res, next) => {
  //get all assignments for a course
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

const getCourseAssignmentByAssignmentD = async (req, res, next) => {
  //get all assignments for a course
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

const getSubmissionByAssignmentID = async (req, res, next) => {
  //get my submission for an assignment id
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

const downloadCourseMaterial = async (req, res, next) => {
  //download a course material
  const courseMaterialID = req.params.courseMaterialID;

  let courseMaterial;
  try {
    courseMaterial = await CourseMaterials.findById(courseMaterialID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find course material.",
      500
    );
    return next(error);
  }

  if (!courseMaterial) {
    const error = new HttpError(
      "Could not find course material for this course material id.",
      404
    );
    return next(error);
  }

  try {
    res.download(courseMaterial.file);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not download course material.",
      500
    );
    return next(error);
  }

  res.status(200).json({ courseMaterial: courseMaterial });
};

const downloadAssignmentMaterial = async (req, res, next) => {
  //download an assignment material
  const assignmentMaterialID = req.params.assignmentMaterialID;

  let assignmentMaterial;
  try {
    assignmentMaterial = await AssignmentMaterials.findById(
      assignmentMaterialID
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find assignment material.",
      500
    );
    return next(error);
  }

  if (!assignmentMaterial) {
    const error = new HttpError(
      "Could not find assignment material for this assignment material id.",
      404
    );
    return next(error);
  }

  try {
    res.download(assignmentMaterial.file);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not download assignment material.",
      500
    );
    return next(error);
  }

  res.status(200).json({ assignmentMaterial: assignmentMaterial });
};

const testgetCompletedAndDueAssignmentsForACourse = async (req, res, next) => {
  //get all completed assignments for a student
  let completedAssignments,
    dueAssignments = [],
    finalCompletedAssignments = [];
  let completed = [],
    due = [];
  let user = await Student.findOne({ user: req.userData.userId });
  let course = await Course.findById(req.params.courseID);

  try {
    completedAssignments = user.submitted_assignments; //these all are submission

    for (var i = 0; i < completedAssignments.length; i++) {
      let relatedSubmission = await Submissions.findById(
        completedAssignments[i].toString()
      );
      var relatedAssignment = await Assignment.findById(
        relatedSubmission.assignment.toString()
      );
      if (relatedAssignment.course.toString() === course._id.toString()) {
        finalCompletedAssignments.push(relatedAssignment._id.toString());
      }
    }

    console.log(finalCompletedAssignments);

    for (var i = 0; i < course.courseAssignments.length; i++) {
      dueAssignments.push(course.courseAssignments[i].toString());
    }

    dueAssignments = dueAssignments.filter(
      (assignment) => !finalCompletedAssignments.includes(assignment)
    );

    console.log(dueAssignments);

    for (var i = 0; i < finalCompletedAssignments.length; i++) {
      completed.push(await Assignment.findById(finalCompletedAssignments[i]));
    }
    for (var i = 0; i < dueAssignments.length; i++) {
      due.push(await Assignment.findById(dueAssignments[i]));
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find completed assignments.",
      500
    );
    return next(error);
  }

  if (!completedAssignments) {
    const error = new HttpError(
      "Could not find completed assignments for this student.",
      404
    );
    return next(error);
  }
  // res.json({message: "Nice work" });

  res.json({
    message: "success",
    completedAssignments: completed,
    dueAssignments: due,
  });
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
exports.downloadCourseMaterial = downloadCourseMaterial;
exports.downloadAssignmentMaterial = downloadAssignmentMaterial;
exports.testgetCompletedAndDueAssignmentsForACourse =
  testgetCompletedAndDueAssignmentsForACourse;
