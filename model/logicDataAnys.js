const mongoose = require("mongoose");

const Schema = mongoose.Schema;
let tanggal = function () {
  const dates = new Date();
  const option = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
  };

  return new Intl.DateTimeFormat("id-ID", option).format(dates);
};

const Product = new Schema({
  namaProduk: {
    type: String,
    required: true,
  },
  hargaProduk: {
    type: Number,
    required: true,
  },
  deskripsi: {
    type: String,
    required: true,
  },

  gambarProduk: {
    type: String,
    required: true,
  },

  hargaIndo: {
    type: String,
    required: true,
  },

  tanggal: {
    type: String,
    default: tanggal(),
  },
});

module.exports = mongoose.model("Produks", Product);

// const mongodb = require("mongodb");
// const getDb = require("../database/mongodb.js").getdb;
// const dates = new Date();
// const option = {
//   hour: "numeric",
//   minute: "numeric",
//   day: "numeric",
//   month: "long",
// };
// class Product {
//   constructor(title, price, description, imageUrl, id, userid) {
//     this.namaProduk = title;
//     this.hargaProduk = new mongodb.Double(price);
//     this.deskripsi = description;
//     this.gambarProduk = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.date = new Intl.DateTimeFormat("id-ID", option).format(dates);
//     this.hargaIndo = new Intl.NumberFormat("id-ID").format(this.hargaProduk);
//     this.userId = userid;
//     this.save();
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection("produks")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else dbOp = db.collection("produks").insertOne(this);

//     return dbOp
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//   }
//   static delete(id) {
//     const db = getDb();
//     return db
//       .collection("produks")
//       .deleteOne({
//         _id: new mongodb.ObjectId(id),
//       })
//       .then((product) => product)
//       .catch((err) => console.log(err));
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("produks")
//       .find()
//       .toArray()
//       .then((produks) => {
//         return produks;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static findById(prodId) {
//     const db = getDb();
//     return db
//       .collection("produks")
//       .find({ _id: new mongodb.ObjectId(prodId) })
//       .next()
//       .then((product) => {
//         return product;
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = Product;
