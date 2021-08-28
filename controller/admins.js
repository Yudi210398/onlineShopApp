const DataAnys = require("../model/logicDataAnys.js");

exports.inputData = (req, res, next) => {
  res.render(`admin/edit-produk`, {
    doctitle: `Input Produk Page`,
    path: `/admin/data-produk/`,
  });
};

exports.postData = (req, res, next) => {
  //! Synchronus data

  /* 
      let namaProduk = req.body["Nama Produk"];
  let gambarUrlProduk = req.body["Gambar Produk"];
  let hargaProduk = req.body["Harga Produk"];
  let deskripsiProduk = req.body.deskripsi;
  let dataProduk = new logicInput(
    namaProduk,
    gambarUrlProduk,
    hargaProduk,
    deskripsiProduk
  );
     */
  let namaProduk = req.body["Nama Produk"];
  let gambarUrlProduk = req.body["Gambar Produk"];
  let hargaProduk = req.body["Harga Produk"];
  let deskripsiProduk = req.body.deskripsi;
  //! AnysChronus Data
  const produkAnys = new DataAnys(
    namaProduk,
    gambarUrlProduk,
    hargaProduk,
    deskripsiProduk
  );

  /* -------------------- */

  res.redirect("/");
};

exports.adminProduks = (req, res, next) => {
  // ! anyshronus data
  DataAnys.semuaData((produk) => {
    res.render(`admin/admin`, {
      doctitle: `Admin Produk Page`,
      produks: produk,
      path: `/admin/admin-produk`,
    });
  });

  // ! synchronus data
  // let produk = logicInput.mintaData();
  // res.render(`admin/admin-produk`, {
  //   doctitle: `Admin Produk Page`,
  //   produks: produk,
  //   path: `/admin/admin-produk`,
  // });
};

exports.edithProduk = (req, res, next) => {
  let dataQuery = req.query.edit;
  if (!dataQuery) return res.redirect("/");
  res.render(`admin/edit-produk`, {
    doctitle: `Input Produk Page`,
    path: `/admin/data-produk/`,
    editing: dataQuery,
  });
};
