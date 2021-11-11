const express = require(`express`);
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const mainData = require(`./routers/shop/mainPage.js`);
const admin = require("./routers/admin/admin.js");
const error = require("./controller/error.js");
const mongoKonek = require("./database/mongodb.js").mongoKonek;
const Users = require("./model/users.js");
// const db = require("./database/mysql.js");
const port = 3000;
app.set("view engine", "ejs");
app.set("views", "views");
// db.execute("SELECT * FROM product")
//   .then((data) => console.log(data[0]))z
//   .catch((err) => console.log(err));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   Users.findById("618161d20072ee30fc6b6ad7")
//     .then((users) => {
//       req.user = new Users(users.nama, users.email, users.keranjang, users._id);
//       console.log(`data meki`);
//       next();
//     })
//     .catch((err) => console.log(err));
// });

app.use((req, res, next) => {
  Users.findById("6186efebe09b75795013ede1")
    .then((user) => {
      req.user = new Users(user.nama, user.email, user.keranjang, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use(mainData);
app.use("/admin", admin);
app.use(error.error);

mongoKonek(() => app.listen(port));
