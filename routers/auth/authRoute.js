const express = require("express");
const contoller = require("../../controller/auth.js");
const routerAuth = express.Router();

routerAuth.get("/login", contoller.login);
routerAuth.post("/login", contoller.postData);

module.exports = routerAuth;