const db = require("../database/mysql.js");

module.exports = class Produkss {
  constructor(id, namaProduk, gambarurl, harga, deskripsi) {
    this.id = id;
    this.namaProduk = namaProduk;
    this.gambarurl = gambarurl;
    this.harga = harga;
    this.deskripsi = deskripsi;
    this.save()
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }

  save() {
    return db.execute(
      "INSERT INTO product (namaProduk, gambarurl, harga, deskripsi) VALUES(?, ?, ?, ?)",
      [this.namaProduk, this.gambarurl, this.harga, this.deskripsi]
    );
  }

  static delete(id) {}

  static semuaData() {
    return db.execute("SELECT * FROM product");
  }

  static findId(id) {
    return db.execute("SELECT * FROM product WHERE product.id = ?", [id]);
  }
};
