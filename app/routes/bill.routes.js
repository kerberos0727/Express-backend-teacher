const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/bill.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/bills/all", [authJwt.verifyToken], controller.getAll);
  // app.get("/api/bills/:userid", [authJwt.verifyToken], controller.getPerson);
  // app.get("/api/bills/:textbookid", [authJwt.verifyToken], controller.getPerTextbookInfo);

};
