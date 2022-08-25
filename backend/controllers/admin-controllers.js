const express = require("express");
const router = express.Router();

const uuid = require("uuid/v4"); // this is to generate unique id
const { validationResult } = require("express-validator"); //this one is to validate the inputs
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const Course = require("../models/courses");
const User = require("../models/users");
const Session = require("../models/sessions");
const Student = require("../models/students");
const Teacher = require("../models/teachers");
const Forum = require("../models/course-forum");
// const checkAuth = require("../middleware/check-auth");

//const DUMMY_COURSES = require("./course-controllers").DUMMY_COURSES; // this is to get the dummy courses from the course-controllers.js

//this one is to create a dummy admin, we will create a new admin in mongoDB later
const DUMMY_ADMIN = [
  {
    id: "a1",
    name: "Max Schwarz",
    email: "test@test.com",
    password: "testers",
  },
];

//this one is to get all admins
const getAdmin = (req, res, next) => {
  res.json({ admin: DUMMY_ADMIN });
};

//this one is to login the admin
const adminLogin = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedAdmin = DUMMY_ADMIN.find((admin) => admin.email === email); //this one is to find the admin with the email
  if (!identifiedAdmin || identifiedAdmin.password !== password) {
    //this one is to check if the password is correct
    throw new HttpError(
      "Could not identify admin, credentials seem to be wrong.",
      401
    ); //this one is to throw an error if the password is wrong
  }

  //this one is to create a token
  let token;

  try {
    token = jwt.sign(
      { userId: identifiedAdmin.id, email: identifiedAdmin.email },
      "supersecret_dont_share_admin",
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.log(err);
    return next(new HttpError("Something went wrong, could not login.", 500));
  }

  res.json({
    success: true,
    admin: identifiedAdmin,
    token: token,
  });

  // res.json({ message: "Logged in!" }); //this one is to send a message if login is successful
};
const adminEnrollUserInBulk = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { series } = req.body;

  let participants = [];

  let users;
  try {
    users = await User.find({});
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Something went wrong, could not enroll users.", 500)
    );
  }
  if (!users) {
    return next(new HttpError("Could not find any users.", 404));
  }
  for (let i = 0; i < users.length; i++) {
    //if users[i].moodleID is in series, add to participants array
    if (users[i].moodleID.startsWith(series.toString())) {
      participants.push(users[i].moodleID);
    }
  }
  console.log(participants);
  const cid = req.params.courseID;

  let course;
  try {
    course = await Course.findById(cid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find course.",
      500
    );
    return next(error);
  }

  if (!course) {
    const error = new HttpError("Could not find course for provided id.", 404);

    return next(error);
  }

  for (let i = 0; i < participants.length; i++) {
    let user;
    try {
      user = await User.findOne({ moodleID: participants[i] });
      course = await Course.findById(cid);
      if (await course.participants.includes(user._id)) {
        console.log("User already enrolled");
        participants.splice(i, 1);
      }
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find user.",
        500
      );
      return next(error);
    }

    if (!user) {
      const error = new HttpError("Could not find user for provided id.", 404);
      return next(error);
    }
  }

  console.log(participants);

  let user;
  if (participants.length > 0) {
    for (const id of participants) {
      try {
        // user = await User.findById(participants);
        user = await User.findOne({ moodleID: id });
        // console.log(user);
        //course = await Course.findById(cid);
        course.participants.push(user);
      } catch (err) {
        const error = new HttpError(
          "Something went wrong, could not find user.",
          500
        );
        return next(error);
      }

      if (!user) {
        const error = new HttpError(
          "Could not find user for provided id.",
          404
        );
        return next(error);
      }
    }
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await course.save({ session: session });

    for await (const id of participants) {
      // const userRelatedToCourse = await User.findById(id);
      const userRelatedToCourse = await User.findOne({ moodleID: id });
      userRelatedToCourse.courses.push(course);
      await userRelatedToCourse.save({ session: session });
      console.log(userRelatedToCourse.moodleID);
    }

    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Updating course failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }

  res.json({ course: course });
};

const adminEnrollUser = async (req, res, next) => {
  //this one is to enroll multiple users to a course
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { participants } = req.body;
  const cid = req.params.courseID;

  let stringWord = "";
  for (let i = 0; i < participants.length; i++) {
    stringWord += participants[i];
  }

  let course;
  try {
    course = await Course.findById(cid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find course.",
      500
    );
    return next(error);
  }

  if (!course) {
    const error = new HttpError("Could not find course for provided id.", 404);

    return next(error);
  }

  for (let i = 0; i < participants.length; i++) {
    let user;
    try {
      user = await User.findOne({ moodleID: participants[i] });
      course = await Course.findById(cid);
      if (await course.participants.includes(user._id)) {
        console.log("User already enrolled");
        participants.splice(i, 1);
      }
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find user.",
        500
      );
      return next(error);
    }

    if (!user) {
      const error = new HttpError("Could not find user for provided id.", 404);
      return next(error);
    }
  }

  console.log(participants);

  let user;
  if (participants.length > 0) {
    for (const id of participants) {
      try {
        // user = await User.findById(participants);
        user = await User.findOne({ moodleID: id });
        // console.log(user);
        //course = await Course.findById(cid);
        course.participants.push(user);
      } catch (err) {
        const error = new HttpError(
          "Something went wrong, could not find user.",
          500
        );
        return next(error);
      }

      if (!user) {
        const error = new HttpError(
          "Could not find user for provided id.",
          404
        );
        return next(error);
      }
    }
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await course.save({ session: session });

    for await (const id of participants) {
      // const userRelatedToCourse = await User.findById(id);
      const userRelatedToCourse = await User.findOne({ moodleID: id });
      userRelatedToCourse.courses.push(course);
      await userRelatedToCourse.save({ session: session });
      console.log(userRelatedToCourse.moodleID);
    }

    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Updating course failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }

  res.json({ course: course });
};

const adminRemovesFromCourse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { participants } = req.body;
  const cid = req.params.courseID;

  let course;
  try {
    course = await Course.findById(cid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find course.",
      500
    );
    return next(error);
  }

  if (!course) {
    const error = new HttpError("Could not find course for provided id.", 404);

    return next(error);
  }

  let user;
  if (participants.length > 0) {
    try {
      user = await User.findOne({ moodleID: participants });
      await course.participants.pull(user);
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find user.",
        500
      );
      return next(error);
    }

    if (!user) {
      const error = new HttpError("Could not find user for provided id.", 404);
      return next(error);
    }
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await course.save({ session: session });
    const userRelatedToCourse = await User.findOne({ moodleID: participants });
    userRelatedToCourse.courses.pull(course);
    await userRelatedToCourse.save({ session: session });
    console.log(userRelatedToCourse.moodleID);
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Deleting from course failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }

  res.json({ course: course });
};

const adminDeleteCourse = async (req, res, next) => {
  const courseID = req.params.courseID;
  let course;
  try {
    course = await Course.findById(courseID).populate("participants");
    sess = await Session.findById(course.sessionID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find course.",
      500
    );
    return next(error);
  }
  if (!course) {
    const error = new HttpError("Could not find course for provided id.", 404);
    return next(error);
  }
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await course.remove({ session: session });
    for await (const user of course.participants) {
      user.courses.pull(course);
      await user.save({ session: session });
    }
    sess.courses.pull(course);
    await sess.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete course.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Course deleted successfully." });
};

const getCoursesList = async (req, res, next) => {
  let courses;
  try {
    courses = await Course.find();
  } catch (err) {
    const error = new HttpError(
      "Failed to fetch courses, please try again.",
      500
    );
    return next(error);
  }
  if (!courses) {
    const error = new HttpError("Could not find courses.", 404);
    return next(error);
  }
  res.json({
    courses: courses.map((course) => course.toObject({ getters: true })),
  });
};

const adminCreateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const {
    moodleID,
    name,
    email,
    password,
    image,
    phone,
    address,
    accessTime,
    role,
    courses,
  } = req.body;

  const createdUser = new User({
    moodleID,
    name,
    email,
    password,
    image,
    phone,
    address,
    accessTime,
    role,
    courses,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Creating user failed, please try again.", 500);
    console.log(err);
    return next(error);
  }

  res.status(201).json({ user: createdUser });
};

const getUsersList = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Failed to fetch users, please try again.",
      500
    );
    return next(error);
  }
  if (!users) {
    const error = new HttpError("Could not find users.", 404);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const adminEditUser = (req, res, next) => {};

const adminDeleteUser = async (req, res, next) => {
  const userID = req.params.userID;

  let user;
  try {
    user = await User.findById(userID).populate("courses");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find course.",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }
  try {
    const session = await mongoose.startSession(); // Start session
    session.startTransaction(); // Start MongoDB transaction
    await user.remove({ session: session }); // Remove user
    for await (const course of user.courses) {
      // Remove user from all courses
      course.participants.pull(user); // Remove user from course
      await course.save({ session: session }); // Save course
    } // End for
    await session.commitTransaction(); // Commit MongoDB transaction
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete course.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "User deleted successfully." });
};

const adminEditSession = async (req, res, next) => {
  // Create session
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
};

const adminCreateSession = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { sessionID, startDate, endDate, courses } = req.body;

  const createdSession = await Session.create({
    sessionID,
    startDate,
    endDate,
    courses,
  });

  try {
    await createdSession.save();
  } catch (err) {
    const error = new HttpError(
      "Creating Session failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }

  res.json({ session: createdSession });
};

const adminDeleteSession = async (req, res, next) => {
  // Delete session
};

const adminGetSessionList = async (req, res, next) => {
  // Get session list
  let sessions;
  try {
    sessions = await Session.find();
  } catch (err) {
    const error = new HttpError(
      "Failed to fetch sessions, please try again.",
      500
    );
    return next(error);
  }
  if (!sessions) {
    const error = new HttpError("Could not find sessions.", 404);
    return next(error);
  }
  res.json({ sessions: sessions });
};

const adminGetSessionBySessionID = async (req, res, next) => {
  // Get session by sessionID
  const sessionID = req.params.sessionID;
  const session = await Session.findOne({ sessionID });
  if (!session) {
    const error = new HttpError("Could not find session.", 404);
    return next(error);
  }
  res.json({ session: session });
};

const adminEnrollSingleUser = async (req, res, next) => {
  //enrol to a course one by one
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const participant = req.body.participants;
  const cid = req.params.courseID;

  // let participant = "";
  // for (let i = 0; i < participants.length; i++) {
  //   participant += participants[i];
  // }

  let course;
  try {
    course = await Course.findById(cid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find course.",
      500
    );
    return next(error);
  }

  if (!course) {
    const error = new HttpError("Could not find course for provided id.", 404);

    return next(error);
  }

  let user;
  if (participant.length > 0) {
    try {
      // user = await User.findById(participants);
      user = await User.findOne({ moodleID: participant });
      if (await course.participants.includes(user._id)) {
        console.log("User already enrolled");
        return res.status(200).json({ message: "User already enrolled" });
      }

      await course.participants.push(user);
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find user.",
        500
      );
      return next(error);
    }

    if (!user) {
      const error = new HttpError("Could not find user for provided id.", 404);
      return next(error);
    }
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await course.save({ session: session });

    // for await (const id of participants)
    {
      // const userRelatedToCourse = await User.findById(id);
      const userRelatedToCourse = await User.findOne({
        moodleID: participant,
      });
      userRelatedToCourse.courses.push(course);
      await userRelatedToCourse.save({ session: session });
      console.log(userRelatedToCourse.moodleID);
    }

    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Updating course failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }

  res.json({ course: course });
};

const adminCreateStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { moodleID, name, email, password } = req.body;
  console.log(req.body);

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const student = new User({
    moodleID,
    name: name,
    email,
    password: hashedPassword,
    role: "student",
  });

  try {
    await student.save(); // Save user
    //now one user is created, we need to link it to a student
    const session = await mongoose.startSession();
    session.startTransaction();
    await student.save({ session: session });
    const createdStudent = new Student({
      user: student,
    });
    await createdStudent.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating student failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: student.id, email: student.email },
      "supersecret_dont_share_student",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Creating Student failed, please try again.",
      500
    );
  }

  res.json({ student: student, token: token, userId: student.id });
};

const createStudentsinBulk = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { series, totalCount } = req.body;
  console.log(req.body);
  let moodleIDs = [];
  let emails = [];
  let passwords = [];
  let roundedId;
  for (let i = 1; i <= totalCount; i++) {
    i < 10
      ? (roundedId = "00" + i.toString())
      : i < 100
      ? (roundedId = "0" + i.toString())
      : (roundedId = i.toString());
    moodleIDs.push(series + "05" + roundedId);
    emails.push(series + "05" + roundedId + "@ugrad.cse.buet.ac.bd.com");
    passwords.push(series + "05" + roundedId);
  }
  console.log(moodleIDs);

  let hashedPasswords = [];
  let tokens = [];
  let students = [];

  for (let i = 0; i < totalCount; i++) {
    try {
      hashedPasswords.push(await bcrypt.hash(passwords[i], 12));
    } catch (err) {
      const error = new HttpError(
        "Could not create user, please try again.",
        500
      );
      return next(error);
    }
  }

  for (let i = 0; i < totalCount; i++) {
    const student = new User({
      moodleID: moodleIDs[i],
      name: "user " + moodleIDs[i],
      email: emails[i],
      password: hashedPasswords[i],
      role: "student",
    });

    try {
      await student.save(); // Save user
      //now one user is created, we need to link it to a student
      const session = await mongoose.startSession();
      session.startTransaction();
      await student.save({ session: session });
      students.push(student);
      const createdStudent = new Student({
        user: student,
      });
      await createdStudent.save({ session: session });
      await session.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        "Creating student failed, please try again.",
        500
      );
      console.log(err);
      return next(error);
    }
    //create token for every student now
    try {
      tokens.push(
        jwt.sign(
          { userId: student.id, email: student.email },
          "supersecret_dont_share_student",
          { expiresIn: "1h" }
        )
      );
    } catch (err) {
      const error = new HttpError(
        "Creating Student failed, please try again.",
        500
      );
    }
  }

  res.json({ students: students, tokens: tokens });
};

const adminCreateTeacher = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { moodleID, name, email, password } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const teacher = new User({
    moodleID,
    name: name,
    email,
    password: hashedPassword,
    role: "teacher",
  });

  try {
    await teacher.save(); // Save user
    //now one user is created, we need to link it to a teacher
    const session = await mongoose.startSession();
    session.startTransaction();
    await teacher.save({ session: session });
    const createdTeacher = new Teacher({
      user: teacher,
    });
    await createdTeacher.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating teacher failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: teacher.id, email: teacher.email },
      "supersecret_dont_share_teacher",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Creating teacher failed, please try again.",
      500
    );
  }

  res.json({ teacher: teacher, token: token, userId: teacher.id });
};

const adminCreateCourseForASession = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const sessionID = req.params.sessionID;
  const { courseID, courseTitle, courseDescription, courseCreditHour } =
    req.body;

  let sessionRelatedToCourse, sessionName, forumName;

  try {
    sessionRelatedToCourse = await Session.findById(sessionID);
    sessionName = sessionRelatedToCourse.sessionID;
    forumName = sessionName + " Forum";
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find session.",
      500
    );
    return next(error);
  }

  const createdCourse = await Course.create({
    sessionID,
    courseID,
    sessionName,
    courseTitle,
    courseDescription,
    courseCreditHour,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdCourse.save({ session: session });
    sessionRelatedToCourse.courses.push(createdCourse);
    await sessionRelatedToCourse.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating course failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }

  const createdForum = await Forum.create({
    forumName: courseID + forumName,
    course: createdCourse,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdForum.save({ session: session });
    const forumRelatedCourse = await Course.findById(createdCourse._id);
    forumRelatedCourse.forum = createdForum;
    await forumRelatedCourse.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating forum failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }

  res.json({ course: createdCourse, forum: createdForum });
};

const adminGetTeachersList = async (req, res, next) => {
  const teachers = await User.find({ role: "teacher" });
  res.json({ teachers });
};

const adminGetStudentsList = async (req, res, next) => {
  const students = await User.find({ role: "student" });
  res.json({ students });
};

const adminGetAvailableTeachersForACourse = async (req, res, next) => {
  const cid = req.params.courseID;
  let course = await Course.findById(cid);
  console.log(course.courseTitle);

  let teachers = await User.find({ role: "teacher" });

  let availableTeachers = [];

  for (let i = 0; i < teachers.length; i++) {
    if (!course.participants.includes(teachers[i]._id)) {
      const relatedTeacher = await User.findById(teachers[i]._id.toString());
      availableTeachers.push(relatedTeacher);
    }
  }

  res.json({ availableTeachers });
};

exports.getAdmin = getAdmin;
exports.adminLogin = adminLogin;
exports.getCoursesList = getCoursesList;
exports.adminDeleteCourse = adminDeleteCourse;
exports.adminEnrollUser = adminEnrollUser;
exports.adminCreateUser = adminCreateUser;
exports.getUsersList = getUsersList;
exports.adminEditUser = adminEditUser;
exports.adminDeleteUser = adminDeleteUser;
exports.adminRemovesFromCourse = adminRemovesFromCourse;
exports.adminCreateSession = adminCreateSession;
exports.adminDeleteSession = adminDeleteSession;
exports.adminGetSessionList = adminGetSessionList;
exports.adminEditSession = adminEditSession;
exports.adminGetSessionBySessionID = adminGetSessionBySessionID;
exports.adminCreateCourseForASession = adminCreateCourseForASession;
exports.adminEditUser = adminEditUser;
exports.adminDeleteUser = adminDeleteUser;
exports.adminRemovesFromCourse = adminRemovesFromCourse;
exports.adminCreateSession = adminCreateSession;
exports.adminDeleteSession = adminDeleteSession;
exports.adminGetSessionList = adminGetSessionList;
exports.adminEditSession = adminEditSession;
exports.adminCreateStudent = adminCreateStudent;
exports.adminCreateTeacher = adminCreateTeacher;
exports.createStudentsinBulk = createStudentsinBulk;
exports.adminEnrollUserInBulk = adminEnrollUserInBulk;
exports.adminGetTeachersList = adminGetTeachersList;
exports.adminGetStudentsList = adminGetStudentsList;
exports.adminGetAvailableTeachersForACourse =
  adminGetAvailableTeachersForACourse;
exports.adminEnrollSingleUser = adminEnrollSingleUser;
