const Produks = require("../model/logicDataAnys.js");
const { produks } = require("./shop.js");

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
  let namaProduk = req.body.namaProduk;
  let gambarProduk = req.body.gambarProduk;
  let hargaProduk = req.body.hargaProduk;
  let deskripsi = req.body.deskripsi;
  //! AnysChronus Data
  // new DataAnys(null, namaProduk, gambarUrlProduk, hargaProduk, deskripsiProduk);
  //! Sequlize data
  req.user
    .createProduk({
      namaProduk,
      gambarProduk,
      hargaProduk,
      deskripsi,
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => console.log(err));
  setTimeout(() => res.redirect("/"), 100);
};

exports.adminProduks = (req, res, next) => {
  // ! anyshronus data
  req.user
    .getProduk()
    .then((produk) => {
      res.render(`admin/admin`, {
        doctitle: `Admin Produk Page`,
        produks: produk,
        path: `/admin/admin-produk`,
      });
    })
    .catch((err) => console.log(err));

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
  req.user
    .getProduk({ whare: { id: dataid } })
    .then((produks) => {
      let produk = produks[0];
      if (!produk) res.redirect("/");
      else
        res.render(`admin/edit-produk`, {
          doctitle: `Input Produk Page`,
          path: `/admin/edith-produk/`,
          editing: dataQuery,
          produk: produk,
        });
    })
    .catch((err) => console.log(err));
};

exports.deleteProduk = (req, res, next) => {
  const dataDelete = req.query.delete;
  if (!dataDelete) return res.redirect("/");
  let id = +req.params.id;
  console.log(id);
  Produks.findByPk(id).then((produk) => {
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
  const dataIdEdit = +req.body.id;
  let namaProduk = req.body.namaProduk;
  let gambarProduk = req.body.gambarProduk;
  let hargaProduk = req.body.hargaProduk;
  let deskripsi = req.body.deskripsi;

  Produks.findByPk(dataIdEdit)
    .then((produk) => {
      produk.namaProduk = namaProduk;
      produk.gambarProduk = gambarProduk;
      produk.hargaProduk = hargaProduk;
      produk.deskripsi = deskripsi;
      return produk.save();
    })
    .then(() => setTimeout(() => res.redirect("/produks"), 0))
    .catch((err) => console.log(err));
};
exports.postHapusProduk = (req, res, next) => {
  const dataIdEdit = +req.body.id;
  Produks.findByPk(dataIdEdit)
    .then((data) => data.destroy())
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
};
