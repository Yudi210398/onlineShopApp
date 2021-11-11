const Produks = require("../model/logicDataAnys.js");
exports.inputData = (req, res, next) => {
  res.render(`admin/edit-produk`, {
    doctitle: `Input Produk Page`,
    path: `/admin/data-produk/`,
    editing: false,
  });
};

exports.postData = (req, res, next) => {
  let namaProduk = req.body.namaProduk;
  let gambarProduk = req.body.gambarProduk;
  let hargaProduk = req.body.hargaProduk;
  let deskripsi = req.body.deskripsi;
  new Produks(
    namaProduk,
    hargaProduk,
    deskripsi,
    gambarProduk,
    null,
    req.user._id
  );

  setTimeout(() => res.redirect("/"), 100);
};

exports.edithProduk = (req, res, next) => {
  let dataQuery = req.query.edita;
  if (!dataQuery) return res.redirect("/");
  let dataid = req.params.id;
  Produks.findById(dataid)
    .then((datas) => {
      if (!datas) res.redirect("/");
      else
        res.render(`admin/edit-produk`, {
          doctitle: `Input Produk Page`,
          path: `/admin/edith-produk/`,
          editing: dataQuery,
          produk: datas,
        });
    })
    .catch((err) => console.log(err));
};

exports.adminProduks = (req, res, next) => {
  // ! anyshronus data
  Produks.fetchAll()
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

exports.postEdithProduks = (req, res, next) => {
  let datas = req.body.idProduk;
  let namaProduk = req.body.namaProduk;
  let gambarProduk = req.body.gambarProduk;
  let hargaProduk = req.body.hargaProduk;
  let deskripsi = req.body.deskripsi;
  new Produks(
    namaProduk,
    hargaProduk,
    deskripsi,
    gambarProduk,
    datas,
    req.user._id
  );
  Produks.findById(datas).then((data) => {
    req.user.editdataItem(data);
  });
  setTimeout(() => res.redirect("/"), 100);
};

exports.deleteProduk = (req, res, next) => {
  const dataDelete = req.query.delete;
  if (!dataDelete) return res.redirect("/");
  let id = req.params.id;

  // ! delete cart item user ketika item dihapus di admin
  req.user.deleteCart(id).then((data) => console.log(data, `data delete`));

  // ! fungsi Hapus admin
  Produks.findById(id).then((produk) => {
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

exports.postHapusProduk = (req, res, next) => {
  const dataIdEdit = req.body.id;
  Produks.delete(dataIdEdit)
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
};
