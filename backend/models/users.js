const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const userSchema = new Schema({
    moodleID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    accessTime: { type: String, required: false },
    role: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);