const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/sequlize.js");

const Produks = sequelize.define("produk", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  namaProduk: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gambarurl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  harga: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Produks;
