// const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

// const DUMMY_USERS = [{
//     id: 'u1',
//     name: 'student',
//     email: 'teststudent@test.com',
//     password: 'studentTester1',
//     role: 'student'
// }];

const getHomepage = (req, res, next) => {
    res.send(
        `
        <div>
    <form method="POST" action="/api/admin/create/user">
        <div>
            <label>Username : </label>
            <input type="text" name="moodleID" id="moodleID" value="moodleID" />
        </div>

        <div>
            <label>name : </label>
            <input type="text" name="name" id="name" value="name"/>
        </div>

        <div>
            <label>email : </label>
            <input type="text" name="email" id="email" value="email"/>
        </div>

        <div>
            <label>password : </label>
            <input type="text" name="password" id="password" value="password"/>
        </div>

        <div>
            <label>image : </label>
            <input type="text" name="image" id="image" value="image"/>
        </div>

        <div>
            <label>phone : </label>
            <input type="text" name="phone" id="phone" value="phone"/>
        </div>

        <div>
            <label>address : </label>
            <input type="text" name="address" id="address" value="address"/>
        </div>

        <div>
            <label>accessTime : </label>
            <input type="text" name="accessTime" id="accessTime" value="accessTime"/>
        </div>

        <div>
            <label>role : </label>
            <input type="text" name="role" id="role" value="role" />
        </div>

        <div>
            <input type="submit" value="Submit" />
        </div>
    </form>
</div>
        `
    );
    // res.json({ users: DUMMY_USERS });
};




exports.getHomepage = getHomepage;
// exports.login = login;
// exports.getCoursesByUserId = getCoursesByUserId;