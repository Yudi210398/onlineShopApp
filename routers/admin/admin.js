const express = require("express");
const contoller = require("../../controller/admins.js");
const routerAdmin = express.Router();

routerAdmin.get("/data-produk", contoller.inputData);
routerAdmin.post(`/data`, contoller.postData);
routerAdmin.get(`/admin-produk/`, contoller.adminProduks);
routerAdmin.post("/edit-produks", contoller.postEdithProduks);
routerAdmin.get(`/edit-produks/:id`, contoller.edithProduk);
module.exports = routerAdmin;
