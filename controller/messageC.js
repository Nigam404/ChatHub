const Message = require("../model/messageM");
const User = require("../model/userM");
const Group = require("../model/groupM");

//............................................................................................
exports.saveMsg = async (req, res, next) => {
  //getting username through userid.
  const user = await User.findByPk(req.USERID);
  const group = await Group.findByPk(req.params.GROUPID);

  //adding message to message table using sequelize associations.(user & message)
  const msg = await user.createMessage({
    message: req.body.message,
    username: user.name,
  });

  //adding message to group table using sequelize associations.(group & message)
  await group.addMessage(msg);

  const msgwithgroupid = await Message.findByPk(msg.id);
  res.status(201).json(msgwithgroupid);
  //..continue from here...
};

//...........................................................................................
exports.getMsg = async (req, res, next) => {
  const group = await Group.findByPk(req.params.GROUPID);

  //using sequelize associations
  const message = await group.getMessages();
  if (message.length > 0) {
    res.status(200).json(message);
  } else {
    res.json([]);
  }
};
