const {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} = require("firebase/storage");
const { storage } = require("../firebase");

//Adding multiple images to storage and return the file path
const addMultipleImages = async (req, res, next) => {
  try {
    const urls = [];
    // for each image in req.files
    for (let i = 0; i < req.files.length; i++) {
      //get the file
      const file = req.files[i];
      // Format the filename
      const timestamp = Date.now();
      const name = file.originalname.split(".")[0];
      const type = file.originalname.split(".")[1];
      const folder = req.body.folder;
      const fileName = `images/${folder}/${name}_${timestamp}.${type}`;
      const fileReference = ref(storage, fileName);
      // Upload the file
      await uploadBytes(fileReference, file.buffer);
      // Get the download URL
      const downloadURL = await getDownloadURL(fileReference);
      //add the download url to the array
      urls.push(downloadURL);
    }
    // Return the download URL
    req.downloadURLs = urls;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

// Add Image to Storage and return the file path
const addFilePath = async (req, res, next) => {
  try {
    // Grab the file
    const file = req.file;
    console.log(file);
    // Format the filename
    const timestamp = Date.now();
    const name = file.originalname.split(".")[0];
    const type = file.originalname.split(".")[1];
    const fileName = `uploads/${name}_${timestamp}.${type}`;
    const file_name = `${name}.${type}`;
    const fileReference = ref(storage, fileName);
    // Upload the file
    await uploadBytes(fileReference, file.buffer);
    // Get the download URL
    const downloadURL = await getDownloadURL(fileReference);
    // Return the download URL
    req.file.downloadURL = downloadURL;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

module.exports = {
  addFilePath,
  addMultipleImages,
};
