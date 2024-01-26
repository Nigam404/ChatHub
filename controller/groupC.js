const Group = require("../model/groupM");
const User = require("../model/userM");
const Usergroup = require("../model/usergroupM");

//.......................................................................................
exports.createGroup = async (req, res, next) => {
  //creating group
  const group = await Group.create({
    name: req.body.name,
  });
  //adding admin/who created group in the group
  const user = await User.findByPk(req.USERID);
  await group.addUsers(user);

  //making the user admin who created the group
  //finding usergroup with userid and groupid
  const usergroup = await Usergroup.findOne({
    where: { userId: user.id, groupId: group.id },
  });
  await usergroup.update({ admin: "true" });

  res.status(201).json(group);
};

//.......................................................................................
exports.getGroup = async (req, res, next) => {
  const user = await User.findByPk(req.USERID);
  const groups = await user.getGroups();
  res.status(200).json(groups);
};

//........................................................................................
exports.getMembers = async (req, res, next) => {
  const group = await Group.findByPk(req.params.GROUPID);
  const users = await group.getUsers();
  res.status(200).json(users);
};

//........................................................................................
exports.addMember = async (req, res, next) => {
  const group_id = req.params.GROUPID;
  const user_id = req.body.memberid;
  const group = await Group.findByPk(group_id);
  const user = await User.findByPk(user_id);
  await group.addUsers(user);
  res.json({ message: "successful" });
};

//.......................................................................................
exports.isAdmin = async (req, res, next) => {
  const user_id = req.USERID;
  const group_id = req.params.GROUPID;
  const usergroup = await Usergroup.findOne({
    where: { userId: user_id, groupId: group_id },
  });
  if (usergroup.admin) {
    console.log("TRUE");
  } else {
    console.log("FALSE");
  }
  res.json(usergroup);
};

//.......................................................................................
exports.isMemberAdmin = async (req, res, next) => {
  const user_id = req.params.USERID;
  const group_id = req.params.GROUPID;
  const usergroup = await Usergroup.findOne({
    where: { userId: user_id, groupId: group_id },
  });
  if (usergroup.admin) {
    console.log("TRUE");
  } else {
    console.log("FALSE");
  }
  res.json(usergroup);
};

//.......................................................................................
exports.makeAdmin = async (req, res, next) => {
  //finding usergroup with userid and groupid
  const usergroup = await Usergroup.findOne({
    where: { userId: req.params.USERID, groupId: req.params.GROUPID },
  });
  await usergroup.update({ admin: "true" });

  res.status(201).json(usergroup);
};

//.......................................................................................
exports.removeUser = async (req, res, next) => {
  const user = await User.findByPk(req.params.USERID);
  const group = await Group.findByPk(req.params.GROUPID);

  //removing user from the group using sequelize association
  await group.removeUser(user);
  res.json({ message: "user removed from group" });
};
