exports.error = (req, res, next) => {
  res.render(`error`, {
    doctitle: `Error Page`,
    path: "",
    autentikasi: req.user,
  });
};
exports.error500 = (req, res, next) => {
  res.render(`error500`, {
    doctitle: `Error Page 500`,
    path: "",
    autentikasi: req.user,
  });
};
