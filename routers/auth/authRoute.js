const express = require("express");
const contoller = require("../../controller/auth.js");
const routerAuth = express.Router();

routerAuth.get("/login", contoller.login);
routerAuth.get("/daftar", contoller.getDaftar);
routerAuth.get("/resetpass", contoller.getReset);
routerAuth.get("/reset/:token", contoller.newPassword);
routerAuth.post("/login", contoller.postData);
routerAuth.post("/logout", contoller.postLogout);
routerAuth.post("/daftar", contoller.postDaftar);
routerAuth.post("/resetpass", contoller.emailResetPass);
routerAuth.post("/newpassreset", contoller.postResetPasswordNew);

module.exports = routerAuth;
