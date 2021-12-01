const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Users = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  keranjang: {
    item: [
      {
        produkId: {
          type: Schema.Types.ObjectId,
          ref: "Produks",
          required: true,
        },
        quantity: { type: Number, required: true },
        hargaProduk: { type: Number, required: true },
      },
    ],
    totalHarga: { type: String },
  },
});

let hargatotalKeranjang = (data) =>
  data.map((a) => a.hargaProduk * a.quantity).reduce((a, b) => a + b, 0);

let hapusFungsi = function (data, object) {
  let totalHargas = hargatotalKeranjang(data);
  object.keranjang.item = data;
  object.keranjang.totalHarga = new Intl.NumberFormat("id-ID").format(
    totalHargas
  );
  return object.save();
};

Users.methods.clearKeranjang = function () {
  this.keranjang = { item: [], totalHarga: undefined };
  return this.save();
};

Users.methods.editData = function (data) {
  const kerajangindex = this.keranjang?.item?.findIndex(
    (cp) => cp.produkId.toString() === data._id.toString()
  );
  if (kerajangindex === -1) return;
  this.keranjang.item[kerajangindex].hargaProduk = data.hargaProduk;

  let hasil = this.keranjang.item;
  let hasilTotal = hargatotalKeranjang(hasil);
  this.keranjang.totalHarga = new Intl.NumberFormat("id-ID").format(hasilTotal);
  return this.save();
};

Users.methods.deleteKeranjang = function (proId) {
  const updatedCartItems = this.keranjang?.item?.filter(
    (items) => items._id.toString().trim() !== proId.toString().trim()
  );

  hapusFungsi(updatedCartItems, this);
};

Users.methods.deleteKeranjangAdmin = function (proId) {
  const updatedCartItems = this.keranjang?.item?.filter(
    (items) => items.produkId.toString().trim() !== proId.toString().trim()
  );
  hapusFungsi(updatedCartItems, this);
};

Users.methods.addProduk = function (produk) {
  // ! Logic tambah Produk keranjang
  const kerajangindex = this.keranjang?.item?.findIndex(
    (cp) => cp.produkId.toString() === produk._id.toString()
  );
  let quantityBaru = 1;
  let updateDataProduk =
    this.keranjang?.item === undefined ? [] : [...this.keranjang.item];
  if (kerajangindex >= 0) {
    quantityBaru = this.keranjang.item[kerajangindex].quantity + 1;
    updateDataProduk[kerajangindex].quantity = quantityBaru;
  } else
    updateDataProduk.push({
      produkId: produk._id,
      quantity: 1,
      hargaProduk: produk.hargaProduk,
    });

  let totalHarga = hargatotalKeranjang(updateDataProduk);

  const updateProduk = {
    item: updateDataProduk,
    totalHarga: new Intl.NumberFormat("id-ID").format(totalHarga),
  };
  this.keranjang = updateProduk;
  return this.save();
};

module.exports = mongoose.model("Users", Users);

/* 

const mongodb = require("mongodb");
const getDb = require("../database/mongodb.js").getdb;
const Produks = require("../model/logicDataAnys.js");
class Users {
  constructor(nama, email, keranjang, id) {
    this.nama = nama;
    this.email = email;
    this.keranjang = keranjang;
    this._id = id;
  }

  hargatotalKeranjang(data) {
    return data
      .map((a) => a.hargaProduk * a.quantity)
      .reduce((a, b) => a + b, 0);
  }

  editdataItem(data) {
    const db = getDb();
    const kerajangindex = this.keranjang?.item?.findIndex(
      (cp) => cp.produkID.toString() === data._id.toString()
    );
    Produks.fetchAll().then((dara) => {
      let hasil = dara.find((a) => a._id.toString() === data._id.toString());

      this.keranjang.item[kerajangindex].hargaProduk = hasil.hargaProduk;

      let hasilakhir = this.keranjang.item;
      let hasilTotal = this.hargatotalKeranjang(hasilakhir);

      const updateProduk = {
        item: hasilakhir,
        totalHarga: new Intl.NumberFormat("id-ID").format(hasilTotal),
      };

      return db
        .collection("users")
        .updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          { $set: { keranjang: updateProduk } }
        );
    });
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
    const kerajangindex = this.keranjang?.item?.findIndex(
      (cp) => cp.produkID.toString() === produk._id.toString()
    );
    let quantityBaru = 1;
    let updateDataProduk =
      this.keranjang?.item === undefined ? [] : [...this.keranjang.item];
    if (kerajangindex >= 0) {
      quantityBaru = this.keranjang.item[kerajangindex].quantity + 1;
      updateDataProduk[kerajangindex].quantity = quantityBaru;
    } else
      updateDataProduk.push({
        produkID: produk._id,
        quantity: 1,
        hargaProduk: produk.hargaProduk,
      });

    let totalHarga = this.hargatotalKeranjang(updateDataProduk);

    const updateProduk = {
      item: updateDataProduk,
      totalHarga: new Intl.NumberFormat("id-ID").format(totalHarga),
    };

    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { keranjang: updateProduk } }
      );
  }

  getKeranjang() {
    const db = getDb();
    let produksId = this.keranjang?.item?.map((p) => p.produkID);

    let data = this.keranjang?.item === undefined ? [] : produksId;
    return db
      .collection("produks")
      .find({ _id: { $in: data } })
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
    const updatedCartItems = this.keranjang?.item?.filter(
      (items) => items.produkID.toString().trim() !== proId.toString().trim()
    );
    const db = getDb();
    let totalHarga = this.hargatotalKeranjang(updatedCartItems);
    return db.collection("users").updateOne(
      { _id: new mongodb.ObjectId(this._id) },
      {
        $set: {
          keranjang: {
            item: updatedCartItems,
            totalHarga: new Intl.NumberFormat("id-ID").format(totalHarga),
          },
        },
      }
    );
  }

  tambahOrder() {
    const db = getDb();
    return this.getKeranjang()
      .then((product) => {
        let hargaProdut = this.hargatotalKeranjang(product);
        const orders = {
          item: product,
          hargaProduk: new Intl.NumberFormat("id-ID").format(hargaProdut),
          user: {
            _id: new mongodb.ObjectId(this._id),
            nama: this.nama,
          },
        };
        return db.collection("orders").insertOne(orders);
      })
      .then((data) => {
        this.keranjang = { item: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { keranjang: { item: [] } } }
          );
      })
      .catch((err) => console.log(err));
  }

  getOrder() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new mongodb.ObjectId(this._id) })
      .toArray();
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(prodId) })
      .then((product) => {
        return product;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Users;


*/
