const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

exports.authenticate = (req, res, next) => {
  const Token = req.header("Authorization");
  const user = jwt.verify(Token, process.env.JWT_SECRET_KEY);
  console.log("User authentication called");
  console.log("Token->", Token);
  req.USERID = user.id; //passing user info to next middleware.
  next();
};
