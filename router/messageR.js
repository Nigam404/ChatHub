const express = require("express");
const router = express.Router();
const multer = require("multer");

const userAuthentication = require("../middleware/authentication");
const messageController = require("../controller/messageC");

//multer method..................................................................................
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, "");
  },
});
const filefilter = (req, file, cb) => {
  cb(null, true);
};
const upload = multer({
  storage: storage,
  fileFilter: filefilter,
});

//routes......................................................................................
router.post(
  "/message/save/:GROUPID",
  userAuthentication.authenticate,
  messageController.saveMsg
);
router.post(
  "/message/sendfile/:GROUPID",
  upload.single("file"),
  userAuthentication.authenticate,
  messageController.sendFile
);

router.get("/message/getmsg/:GROUPID", messageController.getMsg);

module.exports = router;
