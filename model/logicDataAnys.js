const mongodb = require("mongodb");
const getDb = require("../database/mongodb.js").getdb;

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.namaProduk = title;
    this.hargaProduk = new mongodb.Double(price);
    this.deskripsi = description;
    this.gambarProduk = imageUrl;
    this._id = id;
    this.save();
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      console.log(this._id, `wekfkwefk`);
      dbOp = db
        .collection("produks")
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else dbOp = db.collection("produks").insertOne(this);

    return dbOp
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("produks")
      .find()
      .toArray()
      .then((produks) => {
        console.log(produks);
        return produks;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("produks")
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
