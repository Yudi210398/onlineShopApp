const express = require("express");
const { body, check } = require("express-validator/check");
const contoller = require("../../controller/admins.js");
const routerAdmin = express.Router();
const middlerAuth = require("../../middleware/authRoute.js");
routerAdmin.get("/data-produk", middlerAuth, contoller.inputData);
routerAdmin.get(`/admin-produk/`, middlerAuth, contoller.adminProduks);
routerAdmin.get(`/edit-produks/:id`, middlerAuth, contoller.edithProduk);
routerAdmin.get("/hapus-produks/:id", middlerAuth, contoller.deleteProduk);
routerAdmin.post(
  `/data`,
  [
    body("namaProduk", "input tidak berkenan")
      .isLength({ min: 3 })
      .isString()
      .trim(),
    body("deskripsi").isLength({ min: 3, max: 499 }).trim().isString(),
  ],
  middlerAuth,
  contoller.postData
);
routerAdmin.post(
  "/edit-produks",
  [
    body("namaProduk", "input tidak berkenan")
      .isLength({ min: 3 })
      .isString()
      .trim(),
    body("deskripsi").isLength({ min: 3, max: 499 }).trim().isString().trim(),
  ],
  middlerAuth,
  contoller.postEdithProduks
);
routerAdmin.post("/hapus-produks", middlerAuth, contoller.postHapusProduk);
module.exports = routerAdmin;
