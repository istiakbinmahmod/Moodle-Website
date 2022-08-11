const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
    course: { type: mongoose.Types.ObjectId, ref: 'Course' },
    title: { type: String, required: true },
    description: { type: String, required: false },
    dueDate: { type: Date, required: true, Default: Date.now },
    file: { type: String, required: true },
    submitted_assignments: [{ type: mongoose.Types.ObjectId, ref: 'Submission' }], // submissions of the assignment
    is_active: { type: Boolean, default: true, required: false },
    created_at: { type: Date, default: Date.now },
    cutOffDate: { type: Date, default: Date.now },
    marks: { type: Number, default: 0, required: false },
    is_updated: { type: Boolean, default: false, required: false },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Assignment', assignmentSchema);