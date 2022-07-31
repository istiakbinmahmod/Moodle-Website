const mongoose = require("mongoose");

const Session = require("../models/sessions");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseID: { type: String, required: true },
    sessionID: { type: mongoose.Types.ObjectId, ref: "Session" },
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: false },
    courseCreditHour: { type: Number, required: true },
    participants: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    courseMaterials: [{ type: mongoose.Types.ObjectId, ref: "CourseMaterials" }],
});

module.exports = mongoose.model("Course", courseSchema);