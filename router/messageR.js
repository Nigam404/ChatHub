const express = require("express");
const router = express.Router();

const userAuthentication = require("../middleware/authentication");
const messageController = require("../controller/messageC");

router.post(
  "/message/save/:GROUPID",
  userAuthentication.authenticate,
  messageController.saveMsg
);

router.get("/message/getmsg/:GROUPID", messageController.getMsg);

module.exports = router;
