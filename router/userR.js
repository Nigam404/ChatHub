const express = require("express");
const router = express.Router();

const userAuthentication = require("../middleware/authentication");
const userController = require("../controller/userC");

router.post("/user/signup", userController.signup);
router.post("/user/login", userController.login);
router.get("/user/getalluser", userController.getAllUser);
router.get(
  "/user/get-current-user",
  userAuthentication.authenticate,
  userController.getCurrentUser
);

module.exports = router;
