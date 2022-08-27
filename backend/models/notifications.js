const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const notificationSchema = new Schema({
    
    title: { type: String, required: true },
    date: { type: String, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    course_material: { type: Schema.Types.ObjectId, ref: 'CourseMaterial' },
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment' },
    submission: { type: Schema.Types.ObjectId, ref: 'Submission' },
    type: { type: String, required: true },
});



module.exports = mongoose.model('Notification', notificationSchema);