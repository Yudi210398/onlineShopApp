const express = require("express");
const contoller = require("../../controller/shop.js");
const routerMain = express.Router();

routerMain.get("/", contoller.mainData);
routerMain.get("/produks", contoller.produks);
routerMain.get("/produks/:ids", contoller.getProduct);
routerMain.get("/cart", contoller.cart);
routerMain.get("/orders", contoller.orders);
routerMain.post("/cart", contoller.postCart);
routerMain.post("/cart/delete-item", contoller.deleteCart);

module.exports = routerMain;
