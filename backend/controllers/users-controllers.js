const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator"); //this one is to validate the inputs
const mongoose = require("mongoose");
const Course = require("../models/courses");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");
const express = require("express");
const router = express.Router();
const PrivateFile = require("../models/private_files");

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
    console.log(req.body);
    let existingUser;
    try {
        existingUser = await User.findOne({ moodleID: moodleID });
    } catch (err) {
        console.log(err);
        return next(new HttpError("Something went wrong, could not login.", 500));
    }
    if (!existingUser) {
        return next(new HttpError("Could not login, wrong credentials.", 401));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        console.log(err);
        return next(new HttpError("Something went wrong, could not login.", 500));
    }

    if (!isValidPassword) {
        return next(new HttpError("Could not login, wrong credentials.", 401));
    }

    let token;
    try {
        if (existingUser.role === "student") {
            token = jwt.sign({ userId: existingUser.id, moodleID: existingUser.moodleID },
                "supersecret_dont_share_student", { expiresIn: "1h" }
            );

        }
        if (existingUser.role === "teacher") {
            token = jwt.sign({ userId: existingUser.id, moodleID: existingUser.moodleID },
                "supersecret_dont_share_teacher", { expiresIn: "1h" }
            );
        }

    } catch (err) {
        console.log(err);
        return next(new HttpError("Something went wrong, could not login.", 500));
    }



    res.json({
        userId: existingUser.id,
        moodleID: existingUser.moodleID,
        userRole: existingUser.role,
        token: token,
    });
};


const getCoursesByUserId = async(req, res, next) => {
    const userId = req.params.uid;
    const user = await User.findById(userId);
    if (!user) {
        console.log(err);
        return next(new HttpError("Could not find a user for this id.", 404));
    }

    let coursesOfUser;
    try {
        coursesOfUser = await User.findById(userId).populate("courses");
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Something went wrong, could not get courses.", 500)
        );
    }
    if (!coursesOfUser || coursesOfUser.length === 0) {
        return next(new HttpError("Could not get courses, no courses found.", 404));
    }
    res.json({
        courses: coursesOfUser.courses.map((course) =>
            course.toObject({ getters: true })
        ),
    });
};

const userEditProfile = async(req, res, next) => {
    const userID = req.params.uid;

    const user = await User.findById(userID);
    if (!user) {
        console.log(err);
        return next(
            new HttpError("Something went wrong could not get the specific user", 500)
        );
    }
};

const uploadPrivateFiles = async(req, res, next) => {
    const userID = req.userData.userId;
    const user = await User.findById(userID);

    if (!user) {
        console.log(err);
        return next(
            new HttpError("Something went wrong could not get the specific user", 500)
        );
    }

    const createdPrivateFile = new PrivateFile({
        user: userID,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype
    });

    try {
        await createdPrivateFile.save();
        const session = await mongoose.startSession();
        session.startTransaction();
        await createdPrivateFile.save({ session: session });
        await user.privateFiles.push(createdPrivateFile);
        await user.save({ session: session });
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Something went wrong, could not upload file.", 500)
        );
    }

    res.status(201).json({
        message: "File uploaded successfully!",
        createdPrivateFile: createdPrivateFile,
        user: user
    });

};

const getAllPrivateFiles = async(req, res, next) => {
    const userID = req.userData.userId;
    const user = await User.findById(userID);

    if (!user) {
        console.log(err);
        return next(
            new HttpError("Something went wrong could not get the specific user", 500)
        );
    }

    let privateFiles;
    try {
        privateFiles = await PrivateFile.find({ user: userID });
    } catch (err) {
        console.log(err);
        return next(
            new HttpError("Something went wrong, could not get the private files.", 500)
        );
    }
    if (!privateFiles || privateFiles.length === 0) {
        return next(
            new HttpError("Could not get the private files, no private files found.", 404)
        );
    }
    res.json({
        privateFiles: privateFiles.map((privateFile) =>
            privateFile.toObject({ getters: true })
        ),
    });
};


const getPrivateFileByID = async(req, res, next) => {
    const privateFileID = req.params.privateFileID;
    const privateFile = await PrivateFile.findById(privateFileID);
    if (!privateFile) {
        console.log(err);
        return next(new HttpError("Could not find a private file for this id.", 404));
    }
    res.json({ privateFile: privateFile });
};

const deletePrivateFileByID = async(req, res, next) => {
    const privateFileID = req.params.privateFileID;
    const privateFile = await PrivateFile.findById(privateFileID).populate("user");

    if (!privateFile) {
        console.log(err);
        return next(new HttpError("Could not find a private file for this id.", 404));
    }

    let user;
    try {
        user = await User.findById(privateFile.user);
    } catch (err) {
        console.log(err);
        return next(new HttpError("Something went wrong, could not get the user.", 500));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await privateFile.remove({ session: sess });
        await user.privateFiles.pull(privateFile);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err);
        return next(new HttpError("Something went wrong, could not delete the file.", 500));
    }

    res.status(200).json({
        message: "File deleted successfully!"
    });
};




exports.getUserById = getUserById;
exports.login = login;
exports.getCoursesByUserId = getCoursesByUserId;
exports.userEditProfile = userEditProfile;
exports.uploadPrivateFiles = uploadPrivateFiles;
exports.getAllPrivateFiles = getAllPrivateFiles;
exports.getPrivateFileByID = getPrivateFileByID;
exports.deletePrivateFileByID = deletePrivateFileByID;