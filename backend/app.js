const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const multer = require("multer");

const router = express.Router();
const fs = require("fs");
const usersRoutes = require("./routes/users-routes");
const adminRoutes = require("./routes/admin-routes"); // admin-routes.js
const coursesRoutes = require("./routes/course-routes"); // course-routes.js
const homeRoutes = require("./routes/home-routes"); // home-routes.js
const studentRoutes = require("./routes/student-routes"); // student-routes.js
const teacherRoutes = require("./routes/teacher-routes"); // teacher-routes.js


const HttpError = require("./models/http-error");

const app = express();



app.use(bodyParser.json());

// var forms = multer();

// app.use(forms.array());
// app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors());


const {
    ref,
    uploadBytes,
    listAll,
    deleteObject,
} = require("firebase/storage");

const storage = require("./firebase");
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

    next();
});

app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes); // => //this one is for admin-routes.js
app.use("/api/courses", coursesRoutes); // => //this one is for course-routes.js
app.use("/api/students", studentRoutes); // => //this one is for student-routes.js
app.use("/api/teachers", teacherRoutes); // => //this one is for home-routes.js
app.use("/", homeRoutes); // => //this one is for home-routes.js

app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});

router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "index.html"));
});

app.use("/upload-course-materials", express.static("uploads"));

// app.use('/', router);

mongoose
    .connect(
        // "mongodb+srv://shafaet:h4504hTEzqNn8Nrc@cluster0.pbpj0.mongodb.net/moodle?retryWrites=true&w=majority"
        "mongodb+srv://istiakbinmahmod:istiakbinmahmod@moodle.wrcbe1v.mongodb.net/?retryWrites=true&w=majority&appName=moodle"
    )
    .then(() => {
        app.listen(5000);
    })
    .catch((err) => {
        console.log(err);
    });