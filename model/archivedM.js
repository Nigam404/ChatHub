const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Archivedchat = sequelize.define(
  "archivedchat",
  {
    sl_no: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    id: Sequelize.INTEGER,
    message: Sequelize.STRING,
    username: Sequelize.STRING,
    islink: Sequelize.BOOLEAN,
    userId: Sequelize.INTEGER,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    groupId: Sequelize.INTEGER,
  },
  {
    timestamps: false,
  }
);

module.exports = Archivedchat;
