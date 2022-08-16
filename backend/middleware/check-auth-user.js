const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

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

    console.log("comes here");
    console.log(token);
    const decodedToken =
      //   jwt.verify(token, "supersecret_dont_share_teacher") ||
      //   jwt.verify(token, "supersecret_dont_share_admin") ||
      jwt.verify(token, "supersecret_dont_share_student");
    req.userData = { userId: decodedToken.userId };
    console.log("goes here");
    next();
  } catch (err) {
    const error = new HttpError("Authentication Failed", 401);
    return next(error);
  }
};
