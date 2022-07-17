const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  sessionID: { type: String, required: true, unique: true },
  startDate: { type: String, required: false },
  endDate: { type: String, required: false },
  courses: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Session", userSchema);
