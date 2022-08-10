const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]; // Autgorization : 'Bearer TOKEN'
    if (!token) {
        const error = new HttpError()
    }
}