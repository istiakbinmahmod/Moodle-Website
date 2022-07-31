const mongoose = require('mongoose'); // mongoose is the database connection
const Schema = mongoose.Schema;

const privateFilesSchema = new Schema({
    fileName: { type: String, required: false },
    fileType: { type: String, required: false },
    file: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('PrivateFiles', privateFilesSchema);