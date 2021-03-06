const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/sequlize.js");

const CartItem = sequelize.define("cartitem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = CartItem;
