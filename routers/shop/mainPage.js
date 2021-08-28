const express = require("express");
const contoller = require("../../controller/shop.js");
const routerMain = express.Router();

routerMain.get("/", contoller.mainData);
routerMain.get("/produks", contoller.produks);
routerMain.get("/produks/:id", contoller.getProduct);
routerMain.get("/cart", contoller.cart);
routerMain.get("/orders", contoller.orders);
routerMain.post("/cart", contoller.postCart);

module.exports = routerMain;
