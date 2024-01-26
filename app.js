const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();
const path = require("path");

const sequelize = require("./utils/database");
const userRouter = require("./router/userR");
const messageRouter = require("./router/messageR");
const groupRouter = require("./router/groupR");

const User = require("./model/userM");
const Message = require("./model/messageM");
const Group = require("./model/groupM");
const Usergroup = require("./model/usergroupM");

const app = express();

//middlewares
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//routes
app.use(userRouter);
app.use(messageRouter);
app.use(groupRouter);
//if any not defined routes comes in...it will show login page.
app.use((req, res) => {
  console.log("REQUESTING URL->", req.url);
  console.log("FULL PATH ->", path.join(__dirname, `public/${req.url}`));
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

//associations
User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

User.belongsToMany(Group, { through: Usergroup });
Group.belongsToMany(User, { through: Usergroup });

//server
sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));
