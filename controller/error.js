exports.error = (req, res, next) => {
  res.render(`error`, {
    doctitle: `Error Page`,
    path: "",
    autentikasi: req.isLogin,
  });
};
