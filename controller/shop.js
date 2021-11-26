const Produks = require("../model/logicDataAnys.js");
const Order = require("../model/oder-item-sequlize.js");
exports.mainData = (req, res, next) => {
  // let isLogin = req.get("Cookie").split(";")[2].trim().split("=")[1] === `true`;
  // ! anyshronus data
  Produks.find()
    .then((produk) => {
      res.render(`shop/mainPage`, {
        doctitle: `Halaman Produk Page`,
        path: `/`,
        produks: produk,
        autentikasi: req.session.user,
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

  Produks.find()
    .then((produk) => {
      res.render(`shop/produk-list`, {
        doctitle: `Produk Page`,
        path: "/produks",
        produks: produk,
        autentikasi: req.session.user,
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
    .populate("keranjang.item.produkId")
    .then((produk) => {
      const data1 = produk.keranjang.item;

      res.render(`shop/cart`, {
        doctitle: `Cart Page`,
        path: `/cart`,
        produks: data1,
        produksd: req.user,
        autentikasi: req.session.user,
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

exports.deleteCart = async (req, res, next) => {
  let dataid = req.body.prodIds;
  await req.user.deleteKeranjang(dataid);

  await res.redirect("/cart");

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

  console.log(proId, `tete debby`);
  Produks.findById(proId).then((data) => {
    console.log(data);
    res.render("shop/produks-detail", {
      doctitle: `Produk Detail Page`,
      path: `/produks/detail`,
      produk: data,
      hapus: false,
      autentikasi: req.session.user,
    });
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("keranjang.item.produkId")
    .then((produk) => {
      const produks = produk.keranjang.item.map((data) => {
        return { quantity: data.quantity, produk: { ...data.produkId._doc } };
      });
      const order = new Order({
        totalHarga: req.user.keranjang.totalHarga,
        user: {
          nama: req.user.nama,
          userId: req.user._id,
        },
        produks: produks,
      });
      return order.save();
    })
    .then((data) => req.user.clearKeranjang())
    .then((data) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.orders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id })
    .then((data) => {
      res.render(`shop/orders`, {
        doctitle: `Oreders Page`,
        path: `/orders`,
        orders: data,
        autentikasi: req.session.user,
      });
    })
    .catch((err) => console.log(err));
};
