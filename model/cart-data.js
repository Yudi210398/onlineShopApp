const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  `data`,
  "cart.json"
);
module.exports = class Cart {
  static tambahProduk(id, hargabarang, harga) {
    //   ambil semua data  sebelumnya
    fs.readFile(p, (err, fileContent) => {
      let cart = { produks: [], totalHarga: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
        console.log(cart.produks, "Cart logic");
      }
      //   analisis cart dan temukan produk yang diplih user
      const dataprodukindex = cart.produks.findIndex((prod) => prod.id === id);
      const dataproduk = cart.produks[dataprodukindex];
      let perbaruiProduks;
      if (dataproduk) {
        perbaruiProduks = { ...dataproduk };
        console.log(dataprodukindex);
        perbaruiProduks.qty = perbaruiProduks.qty + 1;
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
};
