const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const User = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    mail: Sequelize.STRING,
    phone: Sequelize.STRING,
    password: Sequelize.STRING,
  },
  { timestamps: false }
);

module.exports = User;
