const mongoose = require("mongoose");
const Course = require("../models/courses");
const posts = require("../models/forum-post");

const Schema = mongoose.Schema;

const courseForumSchema = new Schema({
    forumName: { type: String, required: false },
    course: { type: mongoose.Types.ObjectId, ref: "Course" },
    posts: [{ type: mongoose.Types.ObjectId, ref: "Forum-Post" }],


});

module.exports = mongoose.model("Course-Forum", courseForumSchema);