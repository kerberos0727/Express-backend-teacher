const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/student.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/student/create",
    [
      authJwt.verifyToken
    ],
    controller.create
  );

  app.get("/api/student/all", [authJwt.verifyToken], controller.getAll);
  app.get("/api/student/:userid", [authJwt.verifyToken], controller.getPerson);

};
