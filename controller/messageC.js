const Aws = require("aws-sdk");
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
    islink: false,
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

//Upload to s3bucket method................................................................
function uploadToS3(file) {
  //initializing s3 bucket
  const s3bucket = new Aws.S3({}); //IAM user key and secret keys goes here..
  

  //parameter for uploading to aws s3
  const params = {
    Bucket: "expensetrackernigam",
    Key: file.originalname,
    Body: file.buffer,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (error, data) => {
      if (error) {
        // res.status(500).send({ err: error });
        reject(error);
        // console.log(error);
      } else {
        // console.log(data.Location);
        resolve(data.Location);
        // res.json({ link: data.Location });
      }
    });
  });
}

//..........................................................................................
exports.sendFile = async (req, res, next) => {
  // console.log(req.file); //'req.file' is created by multer.upload

  const fileurl = await uploadToS3(req.file);
  console.log(fileurl);

  //saving the url to message table with marking islink to true.
  //getting username through userid.
  const user = await User.findByPk(req.USERID);
  const group = await Group.findByPk(req.params.GROUPID);

  //adding filelink to message table using sequelize associations.(user & message)
  const msg = await user.createMessage({
    message: fileurl,
    username: user.name,
    islink: true,
  });

  //adding link message to group table using sequelize associations.(group & message)
  await group.addMessage(msg);

  const msgwithgroupid = await Message.findByPk(msg.id);
  res.json(msgwithgroupid);
};
