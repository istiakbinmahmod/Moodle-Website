const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

// 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
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        // api_key: "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"
    }
}));

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.headers.authorization.split(" ")[1]; // Autgorization : 'Bearer TOKEN'
        if (!token) {
            const error = new HttpError("Authentication Failed", 401);
            return next(error);
        }

        const decodedToken = jwt.verify(token, "supersecret_dont_share_admin");
        req.userData = { userId: decodedToken.userId };
        next();


    } catch (err) {
        const error = new HttpError("Authentication Failed", 401);
        return next(error);
    }
};