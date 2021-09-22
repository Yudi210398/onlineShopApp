const { Sequelize } = require("sequelize");

const sequlize = new Sequelize("node-complate", "root", "kawasanzombi1998", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequlize;
