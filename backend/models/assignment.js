const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
    course: { type: mongoose.Types.ObjectId, ref: 'Course' },
    title: { type: String, required: true },
    description: { type: String, required: false },
    dueDate: { type: Date, required: true, Default: Date.now },
    file: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'User' }, // user who created the assignment
    submitted_assignments: [{ type: mongoose.Types.ObjectId, ref: 'Submission' }], // submissions of the assignment
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    cut_off_date: { type: Date, default: Date.now },
    marks: { type: Number, default: 0 },
});

module.exports = mongoose.model('Assignment', assignmentSchema);