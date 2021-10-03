const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/sequlize.js");

const Oreders = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Oreders;
