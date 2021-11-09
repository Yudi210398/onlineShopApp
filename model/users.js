const mongodb = require("mongodb");
const getDb = require("../database/mongodb.js").getdb;
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
    } else {
      updateDataProduk.push({
        produkID: produk._id,
        quantity: 1,
        hargaProduk: produk.hargaProduk,
      });
    }
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
    console.log(produksId, `meki lili`);

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
    const updatedCartItems = this.keranjang?.item?.filter((items) => {
      items.produkID.toString() === proId.toString().trim(), `tete sasas`;

      console.log(
        items.produkID.toString() === proId.toString(),
        `memek sayu `
      );
      return items.produkID.toString().trim() !== proId.toString().trim();
    });
    const db = getDb();
    let totalHarga = this.hargatotalKeranjang(updatedCartItems);
    return db
      .collection("users")
      .updateOne(
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
        console.log(product, `meki kontol enaksss`);
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
        console.log(product);
        return product;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Users;
