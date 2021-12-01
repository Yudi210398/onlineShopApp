const express = require("express");
const contoller = require("../../controller/admins.js");
const routerAdmin = express.Router();

routerAdmin.get("/data-produk", contoller.inputData);
routerAdmin.get(`/admin-produk/`, contoller.adminProduks);
routerAdmin.get(`/edit-produks/:id`, contoller.edithProduk);
routerAdmin.get("/hapus-produks/:id", contoller.deleteProduk);
routerAdmin.post(`/data`, contoller.postData);
routerAdmin.post("/edit-produks", contoller.postEdithProduks);
routerAdmin.post("/hapus-produks", contoller.postHapusProduk);
module.exports = routerAdmin;
