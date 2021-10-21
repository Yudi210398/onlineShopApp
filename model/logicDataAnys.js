const getdb = require("../database/mongodb.js").getdb;
const mongoObj = require("mongodb");
class Produks {
  constructor(namaProduk, hargaProduk, deskripsi, gambarProduk) {
    this.namaProduk = namaProduk;
    this.hargaProduk = new mongoObj.Double(hargaProduk);
    this.deskripsi = deskripsi;
    this.gambarProduk = gambarProduk;
    this.tanggal = new Date();
    this.save();
  }
  save() {
    const db = getdb();
    return db
      .collection("produks")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static semuadata() {
    const db = getdb();
    console.log(db);
    return db
      .collection("produks")
      .find()
      .toArray()
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }

  static temukanId(prodId) {
    const db = getdb();
    return db
      .collection("produks")
      .find({ _id: new mongoObj.ObjectId(prodId) })
      .toArray()
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }
}

// const Produks = sequelize.define("produk", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   namaProduk: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   gambarProduk: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   hargaProduk: {
//     type: DataTypes.DOUBLE,
//     allowNull: false,
//   },
//   deskripsi: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

module.exports = Produks;
