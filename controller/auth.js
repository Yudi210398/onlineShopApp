const Users = require("../model/users.js");
exports.login = (req, res, next) => {
  console.log(req.session);
  res.render(`auth/auth`, {
    doctitle: `Login`,
    path: "/login",
    autentikasi: req.session.user,
  });
};

exports.postData = (req, res, next) => {
  req.session.loginAja = true;
  Users.findById("61a0a1783d37a6de77be6e55")
    .then((users) => {
      req.session.user = users;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
