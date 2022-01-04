const express = require(`express`);
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const mainData = require(`./routers/shop/mainPage.js`);
const admin = require("./routers/admin/admin.js");
const Auth = require("./routers/auth/authRoute.js");
const error = require("./routers/error/error.js");
const mongoose = require(`mongoose`);
const Users = require("./model/users.js");
const sessions = require("express-session");
const csrf = require("csurf");
const multer = require(`multer`);
const monggoDbSsssion = require("connect-mongodb-session")(sessions);
const urlMongoDb =
  "mongodb+srv://yudirunat:kawasanzombi1998@cluster0.oaqmd.mongodb.net/shopOnline?retryWrites=true&w=majority";
const port = 3000;
const mongoStore = new monggoDbSsssion({
  uri: urlMongoDb,
  collection: "session",
});
const middlerAuth = require("./middleware/authRoute.js");
const { time } = require("console");

const csrfKeamanan = csrf();
const penyimpananFileMulter = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `gambar`);
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime().toString() + `-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === `image/png` ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  )
    return cb(null, true);
  else cb(null, false);
};
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use("/gambar", express.static(path.join(__dirname, "gambar")));
app.use(
  multer({ storage: penyimpananFileMulter, fileFilter: fileFilter }).single(
    "gambar"
  )
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  sessions({
    secret: `rahasia`,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
  })
);

app.use(csrfKeamanan); //! Posisi middleware csrf harus ada dibawah middleware sesion konfigurasi (Parnting)

app.use((req, res, next) => {
  if (!req.session.user) return next();
  else {
    Users.findById(req.session.user._id)
      .then((users) => {
        if (!users) return next();
        req.user = users;
        return next(); //? taro disini
      })
      .catch((err) => {
        next(new Error(err));
      });
  }

  //! jangan menaruh next() di akhir kalo ada penggilan fungsi
});

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.pesan = req.session.pesan;
  res.locals.pesan2 = req.session.pesan2;
  delete req.session.pesan;
  delete req.session.pesan2;
  next();
});

// app.use((req, res, next) => {
//   Users.findById("6186efebe09b75795013ede1")
//     .then((user) => {
//       req.user = new Users(user.nama, user.email, user.keranjang, user._id);
//       next();
//     })
//     .catch((err) => console.log(err));
// });

app.use(mainData);
app.use("/admin", admin);
app.use(Auth);
app.use(middlerAuth, error);
app.use((error, req, res, next) => {
  res.render(`error500`, {
    doctitle: `Error Page 500`,
    path: "",
    autentikasi: req.user,
  });
});

mongoose
  .connect(urlMongoDb)
  .then((result) => {
    app.listen(port);
    console.log(`conek`);
  })
  .catch((err) => console.log(err));
