const express = require("express");
const contoller = require("../../controller/auth.js");
const expValidator = require("express-validator/check");
const Users = require(".././../model/users.js");
const { promises } = require("nodemailer/lib/xoauth2");
const routerAuth = express.Router();

routerAuth.get("/login", contoller.login);
routerAuth.get("/daftar", contoller.getDaftar);
routerAuth.get("/resetpass", contoller.getReset);
routerAuth.get("/reset/:token", contoller.newPassword);
routerAuth.post("/login", contoller.postData);
routerAuth.post("/logout", contoller.postLogout);
routerAuth.post(
  "/daftar",
  [
    expValidator
      .check(`email`)
      .isEmail()
      .withMessage("Tolong masukan email dengan benar")
      .custom(async (value, { req }) => {
        // if (value === "test@gmail.com")
        //   throw new Error(`email dilindungi, silahkan gunakan email lain`);
        // return true;

        let users = await Users.findOne({ value });
        if (!users) return Promise.reject("Email sudah terdaftar");
      }),
    expValidator
      .body("passdaftar", `password harus berisi 7 huruf dan angka`)
      .isLength({ min: 7 })
      .isAlphanumeric(),
    expValidator
      .body(`passulang`, "Password harus sama")
      .custom((value, { req }) => {
        if (value !== req.body.passdaftar)
          throw new Error(`Password harus sama`);
        return true;
      }),
  ],
  contoller.postDaftar
);
routerAuth.post("/resetpass", contoller.emailResetPass);
routerAuth.post("/newpassreset", contoller.postResetPasswordNew);

module.exports = routerAuth;
