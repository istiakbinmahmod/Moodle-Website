const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const courseSchema = new Schema({
    courseID: { type: String, required: true },
    sessionID: { type: String, required: true },
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: false },
    courseCreditHour: { type: Number, required: true },
    startDate: { type: String, required: false },
    endDate: { type: String, required: false },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]


});

module.exports = mongoose.model('Course', courseSchema);