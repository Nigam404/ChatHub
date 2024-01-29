const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");

const sequelize = require("./utils/database");
const userRouter = require("./router/userR");
const messageRouter = require("./router/messageR");
const groupRouter = require("./router/groupR");

const User = require("./model/userM");
const Message = require("./model/messageM");
const Group = require("./model/groupM");
const Usergroup = require("./model/usergroupM");
const Archivedchat = require("./model/archivedM");

//creating server
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer); //io is for handling sockets

//defining sockets
io.on("connection", (socket) => {
  socket.on("user-message", (message) => {
    io.emit("message", message);
  });
});

//middlewares
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//cron scheduler run at 12am everyday.
cron.schedule("0 0 * * * *", async () => {
  console.log("scheduler called");
  //getting all messages
  const obj = await Message.findAll();

  obj.forEach(async (message) => {
    const messageDate = new Date(message.createdAt).getDate();
    const todayDate = new Date().getDate();

    //moving 1 day older message to Archived chat table and deleting from main table.
    if (todayDate - messageDate >= 0) {
      await Archivedchat.create({
        id: message.id,
        message: message.message,
        username: message.username,
        islink: message.islink,
        userId: message.userId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        groupId: message.groupId,
      });

      await message.destroy(); //deleting from main table after moving to archived table.
    }
  });
});

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
    httpServer.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));
