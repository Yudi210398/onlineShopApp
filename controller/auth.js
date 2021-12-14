const encryptPassword = require("bcryptjs");
const Users = require("../model/users.js");
const nodemail = require("nodemailer");
const crypto = require(`crypto`);
const tranporter = nodemail.createTransport({
  service: "gmail",
  auth: { user: `yudi.berland@gmail.com`, pass: `rjdnlrcfpfgsivvf` },
});

exports.login = (req, res, next) => {
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

exports.getReset = (req, res, next) => {
  res.render(`auth/reset`, {
    doctitle: `reset`,
    path: "/reset",
    autentikasi: req.session.user,
  });
};

exports.postData = async (req, res, next) => {
  try {
    const email = req.body.email;
    const paslogin = req.body.paslogin;
    let users = await Users.findOne({ email });
    if (!users) {
      req.session.pesan = true;
      return res.redirect("/login");
    }
    let hasilPass = await encryptPassword.compare(paslogin, users.password);
    if (hasilPass) {
      req.session.user = users;
      return await req.session.save(() => {
        res.redirect("/");
      });
    } else {
      req.session.pesan = true;
      res.redirect("/login");
    }
  } catch (err) {
    res.redirect("/login");
    console.log(err.message);
    renderError(err.message);
  }
};

exports.postDaftar = async (req, res, next) => {
  try {
    const email = req.body.email.trim();
    const password = req.body.passdaftar;
    const confrimPass = req.body.passulang;
    const dataLogin = await Users.findOne({ email });
    if (dataLogin) {
      req.session.pesan = true;
      return res.redirect("/daftar");
    }
    const encryptPass = await encryptPassword.hash(password, 12);
    await new Users({ email, password: encryptPass }).save();

    return await tranporter.sendMail(
      {
        to: email,
        from: "yudi.berland@gmail.com",
        subject: `succes`,
        html: `<h1>Selamat ${email} anda berhasil membuat akun anda, silahkan login</h1>`,
      },
      (err, sukses) => {
        if (err) console.log(err);
        else {
          req.session.pesan2 = `login`;
          return res.redirect("/login");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
exports.newPassword = async (req, res, next) => {
  try {
    const token = req.params.token.trim();
    let user = await Users.findOne({
      tokenreset: token,
      tokenExpiyed: { $gt: Date.now() },
    });
    if (!user) {
      req.session.pesan2 = `resetKadaluarsa`;
      return res.redirect("/login");
    } else
      res.render(`auth/new-pass`, {
        doctitle: `New Password`,
        path: "/new-pass",
        autentikasi: req.session.user,
        userId: user._id.toString(),
        passwordToken: user.tokenreset,
      });
  } catch (err) {
    console.log(err);
  }
};

exports.postResetPasswordNew = async (req, res, next) => {
  try {
    let newPassword = req.body.password;
    let tokenPass = req.body.passwordToken.trim();
    let id = req.body.userId.trim();
    console.log(id);
    console.log(req.body.userId);
    console.log(req.body.userId === id);
    let user = await Users.findOne({
      tokenreset: tokenPass,
      tokenExpiyed: { $gt: Date.now() },
      _id: id,
    });
    if (!user) {
      req.session.pesan2 = `resetKadaluarsa`;
      return res.redirect("/login");
    } else {
      let hasilHashPass = await encryptPassword.hash(newPassword, 12);
      user.password = hasilHashPass;
      user.tokenExpiyed = undefined;
      user.tokenreset = undefined;
      await user.save();
      req.session.pesan2 = `berhasilGanti`;
      return res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.emailResetPass = async (req, res, next) => {
  try {
    crypto.randomBytes(32, async (err, bufer) => {
      if (err) return res.redirect(`/resetpass`);
      const token = bufer.toString(`hex`);
      let user = await Users.findOne({ email: req.body.email });
      if (!user) {
        req.session.pesan = true;
        return res.redirect("/resetpass");
      }
      user.tokenreset = token;
      user.tokenExpiyed = Date.now() + 3600000;
      user.save();

      return await tranporter.sendMail(
        {
          to: req.body.email,
          from: "yudi.berland@gmail.com",
          subject: `Password Reset`,
          html: `
          <p>kamu sedang meminta password reset</p>
          <p>Click <a href="http://localhost:3000/reset/${token}">link</a> ini </p>
          `,
        },
        (err, sukses) => {
          if (err) console.log(err);
          else {
            req.session.pesan2 = `resetpass`;
            return res.redirect("/login");
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};
