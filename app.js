const express = require('express');
const bodyParser = require('body-parser');

const usersRoutes = require('./routes/users-routes');
const adminRoutes = require('./routes/admin-routes'); // admin-routes.js
const coursesRoutes = require('./routes/course-routes'); // course-routes.js

const HttpError = require('./models/http-error');


const app = express();

app.use(bodyParser.json());

app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes); // => //this one is for admin-routes.js
app.use('/api/courses', coursesRoutes); // => //this one is for course-routes.js

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occurred!' });
});

app.listen(5000);