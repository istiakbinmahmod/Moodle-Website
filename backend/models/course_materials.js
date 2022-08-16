const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseMaterialsSchema = new Schema({
    fileName: { type: String, required: false },
    fileType: { type: String, required: false },
    title: { type: String, required: true },
    file: { type: String, required: true },
    course: { type: mongoose.Types.ObjectId, ref: "Course" },
    // uploader: { type: mongoose.Types.ObjectId, ref: "User" }, //
});

module.exports = mongoose.model("CourseMaterials", courseMaterialsSchema);