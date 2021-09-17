const DataAnys = require("../model/logicDataAnys.js");
const DataCart = require("../model/cart-data.js");
exports.inputData = (req, res, next) => {
  res.render(`admin/edit-produk`, {
    doctitle: `Input Produk Page`,
    path: `/admin/data-produk/`,
    editing: false,
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
  let namaProduk = req.body["Nama Produk"].trim();
  let gambarUrlProduk = req.body["Gambar Produk"].trim();
  let hargaProduk = req.body["Harga Produk"].trim();
  let deskripsiProduk = req.body.deskripsi.trim();
  //! AnysChronus Data
  new DataAnys(null, namaProduk, gambarUrlProduk, hargaProduk, deskripsiProduk);

  /* -------------------- */
  setTimeout(() => res.redirect("/"), 0);
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
  let dataid = +req.params.id;
  DataAnys.findId(dataid, (produk) => {
    if (!produk) res.redirect("/");
    else
      res.render(`admin/edit-produk`, {
        doctitle: `Input Produk Page`,
        path: `/admin/edith-produk/`,
        editing: dataQuery,
        produk: produk,
      });
  });
};

exports.deleteProduk = (req, res, next) => {
  const dataDelete = req.query.delete;
  if (!dataDelete) return res.redirect("/");
  let dataid = +req.params.id;
  DataAnys.findId(dataid, (produk) => {
    if (!produk) res.redirect("/");
    else
      res.render("shop/produks-detail", {
        doctitle: `Hapus Produk Page`,
        path: `/admin/hapus-produk/`,
        produk: produk,
        hapus: dataDelete,
      });
  });
};

exports.postEdithProduks = (req, res, next) => {
  const dataIdEdit = +req.body.prodId;
  let namaProduk = req.body["Nama Produk"];
  let gambarUrlProduk = req.body["Gambar Produk"];
  let hargaProduk = req.body["Harga Produk"];
  let deskripsiProduk = req.body.deskripsi;

  let hasilEditUser = new DataAnys(
    dataIdEdit,
    namaProduk,
    gambarUrlProduk,
    hargaProduk,
    deskripsiProduk
  );
  DataCart.edithData(dataIdEdit, hargaProduk, +hargaProduk);
  res.redirect("/produks");
};

exports.postHapusProduk = (req, res, next) => {
  const dataIdEdit = +req.body.produkId;
  DataAnys.delete(dataIdEdit);
  DataCart.deletecartPro(dataIdEdit);
  res.redirect("/");
};
