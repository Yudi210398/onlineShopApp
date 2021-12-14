const express = require(`express`);
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const mainData = require(`./routers/shop/mainPage.js`);
const admin = require("./routers/admin/admin.js");
const Auth = require("./routers/auth/authRoute.js");
const error = require("./controller/error.js");
const mongoose = require(`mongoose`);
const Users = require("./model/users.js");
const sessions = require("express-session");
const csrf = require("csurf");
const monggoDbSsssion = require("connect-mongodb-session")(sessions);
const urlMongoDb =
  "mongodb+srv://yudirunat:kawasanzombi1998@cluster0.oaqmd.mongodb.net/shopOnline?retryWrites=true&w=majority";
const port = 3000;
const mongoStore = new monggoDbSsssion({
  uri: urlMongoDb,
  collection: "session",
});

const csrfKeamanan = csrf();
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
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
        req.user = users;
        return next(); //? taro disini
      })
      .catch((err) => console.log(err));
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
app.use(error.error);

mongoose
  .connect(urlMongoDb)
  .then((result) => {
    app.listen(port);
    console.log(`conek`);
  })
  .catch((err) => console.log(err));
