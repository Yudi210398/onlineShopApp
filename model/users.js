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
    const db = getDb();
    // ! Logic tambah Produk keranjang
    const kerajangindex = this.keranjang?.item.findIndex(
      (cp) => cp.produkID.toString() === produk._id.toString()
    );
    let quantityBaru = 1;
    let updateDataProduk =
      this.keranjang?.item === undefined ? [] : [...this.keranjang.item];
    if (kerajangindex >= 0) {
      quantityBaru = this.keranjang.item[kerajangindex].quantity + 1;
      updateDataProduk[kerajangindex].quantity = quantityBaru;
    } else {
      updateDataProduk.push({ produkID: produk._id, quantity: 1 });
    }
    const updateProduk = { item: updateDataProduk };

    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { keranjang: updateProduk } }
      );
  }

  getKeranjang() {
    const db = getDb();
    let produksId = this.keranjang.item.map((p) => p.produkID);
    console.log(produksId, `meki lili`);
    return db
      .collection("produks")
      .find({ _id: { $in: produksId } })
      .toArray()
      .then((produkss) => {
        return produkss.map((p) => {
          return {
            ...p,
            quantity: this.keranjang.item.find(
              (i) => i.produkID.toString() === p._id.toString()
            ).quantity,
          };
        });
      });
  }

  deleteCart(proId) {
    let deleteCart = this.keranjang.item.filter((data) => {
      console.log(typeof data.produkID, `memek hana `);
      return data.produkID.toString() !== proId.toString();
    });
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { keranjang: { item: deleteCart } } }
      );
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
