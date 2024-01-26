const express = require("express");
const router = express.Router();

const groupController = require("../controller/groupC");
const userAuthentication = require("../middleware/authentication");

router.get(
  "/group/getgroup",
  userAuthentication.authenticate,
  groupController.getGroup
);
router.get("/group/getmembers/:GROUPID", groupController.getMembers);
router.get(
  "/group/isadmin/:GROUPID",
  userAuthentication.authenticate,
  groupController.isAdmin
);
router.get(
  "/group/ismemberadmin/:USERID/:GROUPID",
  groupController.isMemberAdmin
);
router.get("/group/make-admin/:USERID/:GROUPID", groupController.makeAdmin);
router.get("/group/remove-user/:USERID/:GROUPID", groupController.removeUser);
router.post(
  "/group/create",
  userAuthentication.authenticate,
  groupController.createGroup
);
router.post("/group/addmember/:GROUPID", groupController.addMember);

module.exports = router;
