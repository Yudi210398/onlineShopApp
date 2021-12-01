const express = require("express");
const contoller = require("../../controller/auth.js");
const routerAuth = express.Router();

routerAuth.get("/login", contoller.login);
routerAuth.get("/daftar", contoller.getDaftar);
routerAuth.post("/login", contoller.postData);
routerAuth.post("/logout", contoller.postLogout);
routerAuth.post("/daftar", contoller.postDaftar);

module.exports = routerAuth;
