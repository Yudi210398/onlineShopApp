const express = require("express");
const controller = require("../../controller/error.js");
const routerError = express.Router();

routerError.get("/500", controller.error500);
routerError.use(controller.error);

module.exports = routerError;
