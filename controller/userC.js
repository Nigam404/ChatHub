const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const User = require("../model/userM");

//.............................................................................................
exports.signup = async (req, res, next) => {
  const response = await User.findOne({ where: { mail: req.body.mail } });
  if (response) {
    res.json({ message: "User exist" });
  } else {
    const plainTextPassword = req.body.password;
    const saltRound = 10;
    bcrypt.hash(plainTextPassword, saltRound, async (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        const user = await User.create({
          name: req.body.name,
          mail: req.body.mail,
          phone: req.body.phone,
          password: hash,
        });
        res.status(201).json(user);
        console.log("User data inserted successfully");
      }
    });
  }
};

//..............................................................................................
function generateAccessToken(id) {
  const privateKey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ id: id }, privateKey);
}

//..............................................................................................
exports.login = async (req, res, next) => {
  const mail = req.body.mail;
  const pw = req.body.password;
  const user = await User.findOne({ where: { mail: mail } });
  if (user) {
    bcrypt.compare(pw, user.password, (error, result) => {
      if (error) {
        res.json({ message: "Something Went Wrong!" });
      }
      if (result === true) {
        res.status(201).json({
          message: "Login Successful",
          token: generateAccessToken(user.id),
        });
      } else {
        res.status(401).json({ message: "User Not Authorized" });
      }
    });
  } else {
    res.status(404).json({ message: "User Not Found" });
  }
};

//..........................................................................................
exports.getAllUser = async (req, res, next) => {
  const user = await User.findAll();
  res.json(user);
};

//..........................................................................................
exports.getCurrentUser = async (req, res, next) => {
  const user = await User.findByPk(req.USERID);
  res.json(user);
};
