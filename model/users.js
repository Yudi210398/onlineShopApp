const mongodb = require("mongodb");
const getDb = require("../database/mongodb.js").getdb;

class Users {
  constructor(nama, email, keranjang, id) {
    this.nama = nama;
    this.email = email;
    this.keranjang = keranjang;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  addProduk(produk) {
    const kerajangindex = this.keranjang?.item.findIndex(
      (cp) => cp.produkID.toString() == produk._id.toString()
    );
    let quantityBaru = 1;
    let updateDataProduk =
      this.keranjang?.item === undefined ? [] : [...this.keranjang.item];
    if (kerajangindex >= 0) {
      quantityBaru = this.keranjang.item[kerajangindex].quatity + 1;
      updateDataProduk[kerajangindex].quatity = quantityBaru;
    } else {
      updateDataProduk.push({ produkID: produk._id, quatity: 1 });
    }
    const updateProduk = { item: updateDataProduk };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { keranjang: updateProduk } }
      );
    // !single
    // const db = getDb();
    // const updateData = { item: [{ produkID: produk._id, quatity: 1 }] };
    // return db
    //   .collection("users")
    //   .updateOne(
    //     { _id: new mongodb.ObjectId(this._id) },
    //     { $set: { keranjang: updateData } }
    //   );
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(prodId) })
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Users;
