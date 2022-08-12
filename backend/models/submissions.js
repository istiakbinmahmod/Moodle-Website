const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({

    file: { type: String, required: true },
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment' },
    user: { type: mongoose.Types.ObjectId, ref: 'User' }, // the person who uploads the file
    uploaded_at: { type: Date, default: Date.now },
    is_graded: { type: Boolean, default: false },
    grade: { type: Number, default: 0 },
    comments: { type: String, default: "" },
});

module.exports = mongoose.model('Submission', submissionSchema);