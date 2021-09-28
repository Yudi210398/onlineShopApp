const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/sequlize.js");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  namaUser: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: { type: DataTypes.STRING, allowNull: false },
});

module.exports = User;
