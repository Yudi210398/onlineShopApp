exports.login = (req, res, next) => {
  let isLogin = req.get("Cookie").split(";")[2].trim().split("=")[1];

  res.render(`auth/auth`, {
    doctitle: `Login`,
    path: "/login",
    autentikasi: isLogin,
  });
};

exports.postData = (req, res, next) => {
  res.setHeader("Set-Cookie", "masukAdmin=true");
  res.redirect("/");
};
