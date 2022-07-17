const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const courseSchema = new Schema({
    courseID: { type: String, required: true },
    sessionID: { type: mongoose.Types.ObjectId, ref: 'Session' },
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: false },
    courseCreditHour: { type: Number, required: true },
    startDate: { type: String, required: false },
    endDate: { type: String, required: false },
    participants: [{ type: mongoose.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Course', courseSchema);