const errorCont = {};

errorCont.createError = function (req, res, next) {
  res.status(500);
  next(new Error("This is an error status 500"));
};

module.exports = errorCont;