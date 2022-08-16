const mongoose = require("mongoose");

const forum = require("../models/course-forum");
const user = require("../models/users");

const Schema = mongoose.Schema;

const forumPostSchema = new Schema({
    title: { type: String, required: false },
    postDescription: { type: String, required: true },
    postDate: { type: Date, default: Date.now },
    forum: { type: mongoose.Types.ObjectId, ref: "Course-Forum" },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    replies: [{ type: mongoose.Types.ObjectId, ref: "Post-Reply" }],
    author: { type: String, required: false },
});

module.exports = mongoose.model("Forum-Post", forumPostSchema);