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
    if (err) return cb([]);
    else return cb(JSON.parse(fileContent));
  });
};

module.exports = class Produkss {
  constructor(id, namaProduk, gambarurl, harga, deskripsi) {
    this.id = id;
    this.namaProduk = namaProduk;
    this.gambarurl = gambarurl;
    this.harga = harga;
    this.deskripsi = deskripsi;
    this.save();
  }

  save() {
    getFileAnys((produksdataP) => {
      if (this.id) {
        console.log(this.id, `this`);
        const findId = produksdataP.findIndex((prod) => prod.id === this.id);
        const updateData = [...produksdataP];
        updateData[findId] = this;
        fs.writeFile(p, JSON.stringify(updateData), (err) => {
          console.log(err);
        });
      } else {
        this.id = +(Date.now() + ``).slice(-10);
        produksdataP.push(this);
        fs.writeFile(p, JSON.stringify(produksdataP), (err) => {
          console.log(err);
        });
      }
    });
  }

  static delete(id) {
    getFileAnys((dataload) => {
      let deletId = dataload.filter((data) => data.id !== id);
      let updateData = [...deletId];
      fs.writeFile(p, JSON.stringify(updateData), (err) => {
        console.log(err);
      });
    });
  }

  static semuaData(cb) {
    getFileAnys(cb);
  }

  static findId(id, cb) {
    getFileAnys((dataloads) => {
      let dataId = dataloads.find((p) => p.id === id);
      cb(dataId);
    });
  }
};
