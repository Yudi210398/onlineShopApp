const Produks = require("../model/logicDataAnys.js");
const Users = require("../model/users.js");
const { validationResult } = require("express-validator/check");
exports.inputData = async (req, res, next) => {
  res.render(`admin/edit-produk`, {
    doctitle: `Input Produk Page`,
    path: `/admin/data-produk/`,
    editing: false,
    autentikasi: req.user,
    errors: false,
    datass: false,
    border: [],
  });
};

exports.postData = (req, res, next) => {
  let namaProduk = req.body.namaProduk.trim();
  let gambarProduk = req.body.gambarProduk;
  let hargaProduk = req.body.hargaProduk;
  let deskripsi = req.body.deskripsi;
  let hargaIndo = new Intl.NumberFormat("id-ID").format(hargaProduk);
  const error = validationResult(req);
  console.log(error.array());
  if (!error.isEmpty()) {
    return res.status(422).render(`admin/edit-produk`, {
      doctitle: `Input Produk Page`,
      path: `/admin/data-produk/`,
      editing: false,
      autentikasi: req.user,
      datass: error.array()[0].msg,
      errors: true,
      produk: {
        namaProduk,
        gambarProduk,
        hargaProduk,
        deskripsi,
      },
      border: error.array(),
    });
  }

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
      req.barang = result;
      setTimeout(() => res.redirect("/"), 100);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
          autentikasi: req.user,
          errors: false,
          datass: false,
          border: [],
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.adminProduks = (req, res, next) => {
  // ! anyshronus data
  Produks.find({ userId: req.user._id })
    .populate("userId")
    .then((produk) => {
      res.render(`admin/admin`, {
        doctitle: `Admin Produk Page`,
        produks: produk,
        path: `/admin/admin-produk`,
        autentikasi: req.user,
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

exports.postEdithProduks = async (req, res, next) => {
  try {
    let datas = req.body.idProduk.trim();
    let namaProduk = req.body.namaProduk;
    let gambarProduk = req.body.gambarProduk;
    let hargaProduk = req.body.hargaProduk;
    let deskripsi = req.body.deskripsi;
    let hargaIndo = new Intl.NumberFormat("id-ID").format(hargaProduk);

    const error = validationResult(req);
    console.log(error.array());
    if (!error.isEmpty()) {
      return res.status(422).render(`admin/edit-produk`, {
        doctitle: `Input Edith Page`,
        path: `/admin/data-produk/`,
        editing: true,
        autentikasi: req.user,
        datass: error.array()[0].msg,
        errors: true,
        produk: {
          namaProduk,
          gambarProduk,
          hargaProduk,
          deskripsi,
          _id: datas,
        },
        border: error.array(),
      });
    }

    let data = await Produks.findById(datas);
    if (data.userId.toString() !== req.user._id.toString())
      return res.redirect("/");

    data.namaProduk = namaProduk;
    data.gambarProduk = gambarProduk;
    data.hargaProduk = hargaProduk;
    data.deskripsi = deskripsi;
    data.hargaIndo = hargaIndo;
    let userss = await Users.find();
    userss.map(async (x) => await x.editData(data));

    await data.save();
    setTimeout(() => res.redirect("/"), 100);
    // req.user.editdataItem(data);
  } catch (err) {
    console.log(err);
  }
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
        autentikasi: req.user,
      });
  });
};

exports.postHapusProduk = async (req, res, next) => {
  try {
    const dataIdEdit = req.body.id;
    let data = await Users.find();
    let data1 = await Produks.findById(dataIdEdit);
    if (data1.userId.toString() !== req.user._id.toString())
      return res.redirect("/admin/admin-produk");

    data.map(async (x) => await x.deleteKeranjangAdmin(dataIdEdit));

    await Produks.findByIdAndRemove(dataIdEdit);
    res.redirect("/");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
