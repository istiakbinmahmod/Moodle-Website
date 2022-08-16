const multer = require('multer');



// const fileStorageEngine = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const uploadFile = multer({
//     storage: fileStorageEngine
// });

const memStorage = multer.memoryStorage();
const uploadFile = multer({
    storage: memStorage
});

module.exports = uploadFile;