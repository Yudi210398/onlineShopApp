const encryptPassword = require("bcryptjs");
const Users = require("../model/users.js");

exports.login = (req, res, next) => {
  console.log(req.session);
  res.render(`auth/auth`, {
    doctitle: `Login`,
    path: "/login",
    autentikasi: req.session.user,
  });
};

exports.getDaftar = (req, res, next) => {
  res.render(`auth/daftarUser`, {
    doctitle: `daftar`,
    path: "/daftar",
    autentikasi: req.session.user,
  });
};

exports.postData = async (req, res, next) => {
  try {
    req.session.loginAja = true;
    let users = await Users.findById("61a7baa66ce01d8fc879fa77");
    req.session.user = users;
    const session = await req.session.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.postDaftar = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.passdaftar;
    const confrimPass = req.body.passulang;
    const dataLogin = await Users.findOne({ email });
    if (dataLogin) return res.redirect("/daftar");
    const encryptPass = await encryptPassword.hash(password, 12);
    await new Users({ email, password: encryptPass }).save();
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
