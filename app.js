const express = require(`express`);
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const mainData = require(`./routers/shop/mainPage.js`);
const admin = require("./routers/admin/admin.js");
const error = require("./controller/error.js");
// const db = require("./database/mysql.js");
const sequelize = require("./database/sequlize.js");
const User = require("./model/userSequlize.js");
const Produks = require("./model/logicDataAnys.js");
const Cart = require("./model/cart-data-sequlize.js");
const CartItem = require("./model/cart-item-sequlize.js");
const Order = require("./model/order-data-sequlize.js");
const OrderItem = require("./model/oder-item-sequlize.js");
const port = 3000;
app.set("view engine", "ejs");
app.set("views", "views");
// db.execute("SELECT * FROM product")
//   .then((data) => console.log(data[0]))
//   .catch((err) => console.log(err));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      console.log(user);
      next();
    })
    .catch((err) => console.log(err));
});

app.use(mainData);
app.use("/admin", admin);
app.use(error.error);

Produks.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});
User.hasMany(Produks, { as: "Produk" });
//
User.hasOne(Cart, { as: "User" });
Cart.belongsTo(User, { as: "User" });
//
Cart.belongsToMany(Produks, { through: CartItem, as: "Data" });
Produks.belongsToMany(Cart, { through: CartItem, as: "Data" });
//
Order.belongsTo(User);
User.hasMany(Order, { as: "Order" });
Order.belongsToMany(Produks, { through: OrderItem, as: "Order" });

//
sequelize
  .sync()
  .then((result) => {
    let datas = User.findByPk(1);
    return datas;
  })
  .then((data) => {
    if (!data)
      return User.create({
        namaUser: "Yudi Runat",
        email: "yudi.berland@gmail.com",
      });
    return data;
  })
  .then((user) => {
    return user.createUser();
  })
  .then((hasil) => app.listen(port))
  .catch((err) => console.log(err));
