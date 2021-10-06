const Produks = require("../model/logicDataAnys.js");
const Cart = require("../model/cart-data-sequlize.js");
const User = require("../model/userSequlize.js");
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
  let quantitybaru = 1;
  req.user
    .getUser()
    .then((cart) => {
      hasilSeleksi = cart;
      return cart.getData({ where: { id: dataId } });
    })
    .then((datas) => {
      let dataCart;
      if (datas.length > 0) dataCart = datas[0];

      if (dataCart) {
        let quantityLama = dataCart.cartitem.quantity;
        quantitybaru = quantityLama + 1;
        return dataCart;
      }
      return req.user.getProduk({ where: { id: dataId } });
    })
    .then((dataCart) => {
      return hasilSeleksi.addData(dataCart, {
        through: { quantity: quantitybaru },
      });
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

exports.deleteCart = (req, res, next) => {
  let dataid = +req.body.prodId;

  req.user
    .getUser()
    .then((data) => {
      console.log(`hapus data kontol`, data);

      return data.getData({ where: { id: dataid } });
    })
    .then((produk) => {
      console.log(produk);
      let produks = produk[0];
      return produks.cartitem.destroy();
    })
    .then((hasil) => res.redirect("/cart"))
    .catch((err) => console.log(err));

  // ! database JSon
  /* 
    Produks.findId(dataid, (produk) => {
    Cart.deletecartPro(dataid);
    res.redirect("/cart");
  });
  */
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

exports.postOrder = (req, res, next) => {
  let datasemua;
  req.user
    .getUser()
    .then((data) => {
      datasemua = data;
      return data.getData();
    })
    .then((result) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addOrder(
            result.map((prod) => {
              console.log(prod.dataValues.hargaProduk);
              prod.orderitem = { quantity: prod.cartitem.quantity };
              return prod;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((data) => datasemua.setData(null))
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log(err));
};

exports.orders = (req, res, next) => {
  req.user
    .getOrder()
    .then((data) => {
      console.log(data, "titit memek");
      res.render(`shop/orders`, {
        doctitle: `Oreders Page`,
        path: `/orders`,
        orders: data,
      });
    })
    .catch((err) => console.log(err));
};
