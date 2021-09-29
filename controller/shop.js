const Produks = require("../model/logicDataAnys.js");
const Cart = require("../model/cart-data-sequlize.js");
exports.mainData = (req, res, next) => {
  // ! anyshronus data
  Produks.findAll()
    .then((produk) => {
      res.render(`shop/mainPage`, {
        doctitle: `Halaman Produk Page`,
        path: `/`,
        produks: produk,
      });
    })
    .catch((err) => console.log(err));

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
  // DataAnys.semuaData((produk) => {
  //   res.render(`shop/produk-list`, {
  //     doctitle: `Produks Page`,
  //     path: ``,
  //     produks: produk,
  //   });
  // });

  Produks.findAll()
    .then((produk) => {
      res.render(`shop/produk-list`, {
        doctitle: `Produk Page`,
        path: "/produks",
        produks: produk,
      });
    })
    .catch((err) => console.log(err));

  // ! synchronus data
  // let produk = logicInput.mintaData();
  // res.render(`shop/produk-list`, {
  //   doctitle: `Produks Page`,
  //   path: `/produks`,
  //   produks: produk,
  // });

  //! mysql data
  // DataAnys.semuaData().then(([datas, filed]) => {
  //   res.render(`shop/produk-list`, {
  //     doctitle: `Produks Page`,
  //     path: `/produks`,
  //     produks: datas,
  //   });
  // });
};

exports.cart = (req, res, next) => {
  req.user
    .getUser()
    .then((data) => {
      return data
        .getData()
        .then((produk) => {
          res.render(`shop/cart`, {
            doctitle: `Cart Page`,
            path: `/cart`,
            produks: produk,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));

  // Cart.getData((dataCart) => {
  //   DataAnys.semuaData((datas) => {
  //     const dataREsult = [];
  //     for (const data of datas) {
  //       const dataKeranjang = dataCart.produks.find(
  //         (dataid) => dataid.id === data.id
  //       );
  //       if (dataKeranjang)
  //         dataREsult.push({
  //           dataProduk: data,
  //           qty: dataKeranjang.qty,
  //           hargaSatuan: dataKeranjang.harga,
  //         });
  //     }
  //     res.render(`shop/cart`, {
  //       doctitle: `Cart Page`,
  //       path: `/cart`,
  //       produks: dataREsult,
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  let dataId = +req.body.produkId;
  let hasilSeleksi;
  req.user
    .getUser()
    .then((cart) => {
      hasilSeleksi = cart;
      return cart.getData({ where: { id: dataId } });
    })
    .then((datas) => {
      let dataCart;
      if (datas.length > 0) dataCart = datas[0];
      let quantitybaru = 1;
      if (dataCart) {
        //
      }
      return req.user.getProduk({ where: { id: dataId } }).then((hasil) => {
        return hasilSeleksi.addData(hasil, {
          through: { quantity: quantitybaru },
        });
      });
    })
    .catch((err) => console.log(err))
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

exports.deleteCart = (req, res, next) => {
  let dataid = +req.body.prodId;

  Produks.findId(dataid, (produk) => {
    Cart.deletecartPro(dataid);
    res.redirect("/cart");
  });
};

exports.getProduct = (req, res, next) => {
  const proId = +req.params.ids;
  Produks.findByPk(proId).then((data) => {
    res.render("shop/produks-detail", {
      doctitle: `Produk Detail Page`,
      path: `/produks/detail`,
      produk: data,
      hapus: false,
    });
  });
};

exports.orders = (req, res, next) => {
  res.render(`shop/orders`, {
    doctitle: `Oreders Page`,
    path: `/orders`,
  });
};
