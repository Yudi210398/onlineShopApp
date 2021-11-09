const Produks = require("../model/logicDataAnys.js");
exports.mainData = (req, res, next) => {
  // ! anyshronus data
  Produks.fetchAll()
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

  Produks.fetchAll()
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
    .getKeranjang()
    .then((produk) => {
      res.render(`shop/cart`, {
        doctitle: `Cart Page`,
        path: `/cart`,
        produks: produk,
      });
    })
    .catch((err) => console.log(err));

  // req.user
  //   .getKeranjang()
  //   .then((products) => {
  //     res.render("shop/cart", {
  //       path: "/cart",
  //       pageTitle: "Your Cart",
  //       products: products,
  //     });
  //   })
  //   .catch((err) => console.log(err));

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
  let dataId = req.body.produkId;
  console.log(req.user, `data hana`);
  Produks.findById(dataId)
    .then((data) => {
      return req.user.addProduk(data);
    })
    .then((data) => res.redirect("/cart"))
    .catch((err) => console.log(err));

  // let hasilSeleksi;
  // let quantitybaru = 1;
  // req.user
  //   .getUser()
  //   .then((cart) => {
  //     hasilSeleksi = cart;
  //     return cart.getData({ where: { id: dataId } });
  //   })
  //   .then((datas) => {
  //     let dataCart;
  //     if (datas.length > 0) dataCart = datas[0];

  //     if (dataCart) {
  //       let quantityLama = dataCart.cartitem.quantity;
  //       quantitybaru = quantityLama + 1;
  //       return dataCart;
  //     }
  //     return req.user.getProduk({ where: { id: dataId } });
  //   })
  //   .then((dataCart) => {
  //     return hasilSeleksi.addData(dataCart, {
  //       through: { quantity: quantitybaru },
  //     });
  //   })
  //   .then(() => res.redirect("/cart"))
  //   .catch((err) => console.log(err));
};

exports.deleteCart = (req, res, next) => {
  let dataid = req.body.prodIds;
  console.log(dataid, `tete sasa`);
  req.user
    .deleteCart(dataid)
    .then((data) => {
      console.log(dataid, `data delete`);
      res.redirect("/cart");
    })
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
  const proId = req.params.ids;

  console.log(proId);
  Produks.findById(proId).then((data) => {
    console.log(data);
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
    .tambahOrder()
    .then((data) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.orders = (req, res, next) => {
  req.user
    .getOrder()
    .then((data) => {
      res.render(`shop/orders`, {
        doctitle: `Oreders Page`,
        path: `/orders`,
        orders: data,
      });
    })
    .catch((err) => console.log(err));
};
