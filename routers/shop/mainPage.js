const express = require("express");
const contoller = require("../../controller/shop.js");
const routerMain = express.Router();
const middlerAuth = require("../../middleware/authRoute.js");

routerMain.get("/", contoller.mainData);
routerMain.get("/produks", contoller.produks);
routerMain.get("/produks/:ids", contoller.getProduct);
routerMain.get("/cart", middlerAuth, contoller.cart);
routerMain.get("/orders", middlerAuth, contoller.orders);
routerMain.get("/orders/:orderId", middlerAuth, contoller.invoice);
routerMain.post("/cart", middlerAuth, contoller.postCart);
routerMain.post("/cart/delete-item", middlerAuth, contoller.deleteCart);
routerMain.post("/order-data", middlerAuth, contoller.postOrder);

module.exports = routerMain;
