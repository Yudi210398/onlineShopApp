const express = require(`express`);
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const mainData = require(`./routers/shop/mainPage.js`);
const admin = require("./routers/admin/admin.js");
const error = require("./controller/error.js");
const mongoKonek = require("./database/mongodb.js").mongoKonek;
// const db = require("./database/mysql.js");
const port = 3001;
app.set("view engine", "ejs");
app.set("views", "views");
// db.execute("SELECT * FROM product")
//   .then((data) => console.log(data[0]))
//   .catch((err) => console.log(err));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     console.log(user);
  //     next();
  //   })
  //   .catch((err) => console.log(err));
  next();
});

app.use(mainData);
app.use("/admin", admin);
app.use(error.error);

mongoKonek(() => app.listen(port));
