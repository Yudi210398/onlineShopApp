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
const port = 3000;
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  Users.findById("61969ab346161fc58f5b0d80")
    .then((users) => {
      req.user = users;
      next();
    })
    .catch((err) => console.log(err));
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
  .connect(
    "mongodb+srv://yudirunat:kawasanzombi1998@cluster0.oaqmd.mongodb.net/shopOnline?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(port);
    Users.findOne().then((data) => {
      if (!data) {
        const user = new Users({
          nama: `Yudi Runat Masneno`,
          email: `yudi.berland@gmail.com`,
        });
        user.save();
      }
    });

    console.log(`conek`);
  })
  .catch((err) => console.log(err));
