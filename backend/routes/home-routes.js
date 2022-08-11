const express = require('express');
const { check } = require('express-validator');


const homeController = require('../controllers/home-controllers'); //this one is to import admin-controllers.js

const router = express.Router();

router.get('/', homeController.getHomepage); // => localhost:5000/admin/.. if admin is logged in this page will be shown and if not it will redirect to login page







module.exports = router;