const DataAnys = require("../model/logicDataAnys.js");
const Cart = require("../model/cart-data.js");
exports.mainData = (req, res, next) => {
  // ! anyshronus data
  DataAnys.semuaData((produk) => {
    res.render(`shop/mainPage`, {
      doctitle: `Halaman Produk Page`,
      path: `/`,
      produks: produk,
    });
  });

  // ! synchronus data
  // let produk = logicInput.mintaData();
  // res.render(`shop/mainPageView`, {
  //   doctitle: `Halaman Produk Page`,
  //   path: `/`,
  //   produks: produk,
  // });
};

exports.produks = (req, res, next) => {
  // ! anyshronus data
  DataAnys.semuaData((produk) => {
    res.render(`shop/produk-list`, {
      doctitle: `Produks Page`,
      path: `/produks`,
      produks: produk,
    });
  });

  // ! synchronus data
  // let produk = logicInput.mintaData();
  // res.render(`shop/produk-list`, {
  //   doctitle: `Produks Page`,
  //   path: `/produks`,
  //   produks: produk,
  // });
};

exports.cart = (req, res, next) => {
  res.render(`shop/cart`, {
    doctitle: `Cart Page`,
    path: `/cart`,
  });
};

exports.postCart = (req, res, next) => {
  let dataId = +req.body.produkId;
  DataAnys.findId(dataId, (produks) => {
    Cart.tambahProduk(dataId, produks.harga, +produks.harga);
  });
  res.redirect("/cart");
};

exports.getProduct = (req, res, next) => {
  const proId = +req.params.id;
  DataAnys.findId(proId, (data) => {
    res.render("shop/produks-detail", {
      doctitle: `Produk Detail Page`,
      path: `/produks`,
      produk: data,
    });
  });
};

exports.orders = (req, res, next) => {
  res.render(`shop/orders`, {
    doctitle: `Oreders Page`,
    path: `/orders`,
  });
};
