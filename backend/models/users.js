const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const userSchema = new Schema({
    moodleID: { type: String, required: true, unique: true },
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    accessTime: { type: String, required: false, default: Date.now },
    role: { type: String, required: true }, //student, teacher, admin
    courses: [{ type: mongoose.Types.ObjectId, ref: 'Course' }], //this is the courses that the user is taking right now
    privateFiles: [{ type: mongoose.Types.ObjectId, ref: 'PrivateFiles' }] //this is the private files that the user has uploaded
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);