exports.login = (req, res, next) => {
  console.log(req.session.loginAja);
  res.render(`auth/auth`, {
    doctitle: `Login`,
    path: "/login",
    autentikasi: req.session,
  });
};

exports.postData = (req, res, next) => {
  req.session.loginAja = true;
  res.redirect("/");
};
