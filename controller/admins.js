const Produks = require("../model/logicDataAnys.js");

exports.inputData = (req, res, next) => {
  res.render(`admin/edit-produk`, {
    doctitle: `Input Produk Page`,
    path: `/admin/data-produk/`,
    editing: false,
    autentikasi: req.isLogin,
  });
};

exports.postData = (req, res, next) => {
  let namaProduk = req.body.namaProduk;
  let gambarProduk = req.body.gambarProduk;
  let hargaProduk = req.body.hargaProduk;
  let deskripsi = req.body.deskripsi;
  let hargaIndo = new Intl.NumberFormat("id-ID").format(hargaProduk);
  let produks = new Produks({
    namaProduk,
    hargaProduk,
    deskripsi,
    gambarProduk,
    hargaIndo,
    userId: req.user._id,
  });

  produks
    .save()
    .then((result) => {
      console.log(`selesai buat produks`);
      setTimeout(() => res.redirect("/"), 100);
    })
    .catch((err) => console.log(err));
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
          autentikasi: req.isLogin,
        });
    })
    .catch((err) => console.log(err));
};

exports.adminProduks = (req, res, next) => {
  // ! anyshronus data
  Produks.find()
    .populate("userId")
    .then((produk) => {
      console.log(produk);
      res.render(`admin/admin`, {
        doctitle: `Admin Produk Page`,
        produks: produk,
        path: `/admin/admin-produk`,
        autentikasi: req.isLogin,
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
  let hargaIndo = new Intl.NumberFormat("id-ID").format(hargaProduk);
  Produks.findById(datas)
    .then((data) => {
      data.namaProduk = namaProduk;
      data.gambarProduk = gambarProduk;
      data.hargaProduk = hargaProduk;
      data.deskripsi = deskripsi;
      data.hargaIndo = hargaIndo;
      req.user.editData(data);
      return data.save();
      // req.user.editdataItem(data);
    })
    .then((result) => setTimeout(() => res.redirect("/"), 100))
    .catch((err) => console.log(err));
};

exports.deleteProduk = (req, res, next) => {
  const dataDelete = req.query.delete;
  if (!dataDelete) return res.redirect("/");
  let id = req.params.id;

  // ! delete cart item user ketika item dihapus di admin
  // req.user.deleteCart(id).then((data) => console.log(data, `data delete`));

  // ! fungsi Hapus admin
  Produks.findById(id).then((produk) => {
    if (!produk) res.redirect("/");
    else
      res.render("shop/produks-detail", {
        doctitle: `Hapus Produk Page`,
        path: `/admin/hapus-produk/`,
        produk: produk,
        hapus: dataDelete,
        autentikasi: req.isLogin,
      });
  });
};

exports.postHapusProduk = (req, res, next) => {
  const dataIdEdit = req.body.id;
  req.user.deleteKeranjangAdmin(dataIdEdit);
  Produks.findByIdAndRemove(dataIdEdit)
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
};
