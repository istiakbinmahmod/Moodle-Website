const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    fileName: { type: String, required: false },
    fileType: { type: String, required: false },
    file: { type: String, required: true },
    course: { type: mongoose.Types.ObjectId, ref: 'Course' },
    user: { type: mongoose.Types.ObjectId, ref: 'User' }, // the person who uploads the file
    teacher: { type: mongoose.Types.ObjectId, ref: 'Teacher' }, // the teacher who is assigned to the course
    uploaded_at: { type: Date, default: Date.now },
    is_approved: { type: Boolean, default: false },
    is_rejected: { type: Boolean, default: false },
    is_submitted: { type: Boolean, default: false },
    is_graded: { type: Boolean, default: false },
    grade: { type: Number, default: 0 },
    comments: { type: String, default: "" },
});

module.exports = mongoose.model('Submission', submissionSchema);