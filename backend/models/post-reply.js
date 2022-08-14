const mongoose = require("mongoose");

const forum = require("../models/course-forum");
const user = require("../models/users");
const forumPost = require("../models/forum-post");

const Schema = mongoose.Schema;

const postReplySchema = new Schema({
    replyDescription: { type: String, required: true },
    replyDate: { type: Date, default: Date.now },
    post: { type: mongoose.Types.ObjectId, ref: "Forum-Post" },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Post-Reply", postReplySchema);