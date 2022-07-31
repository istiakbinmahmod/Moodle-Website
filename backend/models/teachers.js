const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    designation: { type: String, required: false },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    completed_courses: [{ type: mongoose.Types.ObjectId, ref: 'Course' }],
    private_files: [{ type: mongoose.Types.ObjectId, ref: 'PrivateFiles' }],
    uploaded_course_materials: [{ type: mongoose.Types.ObjectId, ref: 'CourseMaterials' }]
});

module.exports = mongoose.model('Teacher', teacherSchema);