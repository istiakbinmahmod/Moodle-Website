const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const studentSchema = new Schema({
    level: { type: Number, required: false },
    term: { type: Number, required: false },
    CGPA: { type: Number, required: false },
    regular_status: { type: String, required: false },
    completed_credit: { type: Number, required: false },
    remaining_credit: { type: Number, required: false },
    completed_courses: [{ type: mongoose.Types.ObjectId, ref: 'Course' }],
    user: { type: mongoose.Types.ObjectId, ref: 'User' }

});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Student', studentSchema);