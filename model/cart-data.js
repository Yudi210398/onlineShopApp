const fs = require("fs");
const path = require("path");
let cart = { produks: [], totalHarga: 0 };
const p = path.join(
  path.dirname(process.mainModule.filename),
  `data`,
  "cart.json"
);
function readDAta(cb) {
  fs.readFile(p, (err, fileContent) => {
    if (err) return cb(cart);
    else cart = cb(JSON.parse(fileContent));
  });
}

module.exports = class Cart {
  static tambahProduk(id, hargabarang, harga) {
    //   ambil semua data  sebelumnya
    readDAta((cart) => {
      //   analisis cart dan temukan produk yang diplih user
      const dataprodukindex = cart.produks.findIndex((prod) => prod.id === id);
      const dataproduk = cart.produks[dataprodukindex];
      let perbaruiProduks;
      if (dataproduk) {
        perbaruiProduks = { ...dataproduk };
        perbaruiProduks.qty = perbaruiProduks.qty + 1;
        perbaruiProduks.harga = harga;
        cart.produks = [...cart.produks];
        cart.produks[dataprodukindex] = perbaruiProduks;
      } else {
        perbaruiProduks = { id, qty: 1, harga };
        cart.produks = [...cart.produks, perbaruiProduks];
      }
      cart.totalHarga = cart.totalHarga + +hargabarang;
      fs.writeFile(p, JSON.stringify(cart), (err) => console.log(err));
    });
  }

  static edithData(id, hargabarang, harga) {
    readDAta((cart) => {
      const dataprodukindex = cart.produks.findIndex((prod) => prod.id === id);
      const dataproduk = cart.produks[dataprodukindex];
      let perbaruiProduks;
      if (dataproduk) {
        perbaruiProduks = { ...dataproduk };
        perbaruiProduks.harga = harga;
        cart.produks = [...cart.produks];
        cart.produks[dataprodukindex] = perbaruiProduks;
      }
      cart.totalHarga = cart.produks[dataprodukindex].qty * +harga;
      console.log(cart.produks[dataprodukindex].qty * +harga);
      fs.writeFile(p, JSON.stringify(cart), (err) => console.log(err));
    });
  }

  static deletecartPro(id) {
    readDAta((cart) => {
      //   analisis cart dan temukan produk yang diplih user
      const dataprodukindex = cart.produks.findIndex((prod) => prod.id === id);
      const dataproduk = cart.produks[dataprodukindex];
      let dataIndex = cart.totalHarga - dataproduk.qty * dataproduk.harga;
      cart.totalHarga = dataIndex;
      cart.produks = cart.produks.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(cart), (err) => console.log(err));
    });
  }
};
