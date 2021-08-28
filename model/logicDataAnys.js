const { json } = require("body-parser");
const fs = require("fs");
const path = require("path");
const p = path.join(
  path.dirname(process.mainModule.filename),
  `data`,
  "dataAnys.json"
);
let getFileAnys = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    } else return cb(JSON.parse(fileContent));
  });
};

module.exports = class Produkss {
  id = +(Date.now() + ``).slice(-10);
  constructor(namaProduk, gambarurl, harga, deskripsi) {
    this.namaProduk = namaProduk;
    this.gambarurl = gambarurl;
    this.harga = harga;
    this.deskripsi = deskripsi;
    this.save();
  }

  save() {
    getFileAnys((produksdataP) => {
      produksdataP.push(this);
      fs.writeFile(p, JSON.stringify(produksdataP), (err) => {
        console.log(err);
      });
    });
  }

  static semuaData(cb) {
    getFileAnys(cb);
  }

  static findId(id, cb) {
    getFileAnys((dataLoad) => {
      let dataId = dataLoad.find((p) => p.id === id);
      cb(dataId);
    });
  }
};
