const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/lesson.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/lessons/all/:pagenum/:limitnum", [authJwt.verifyToken], controller.getAll);
  app.get("/api/lessons/:lessonid", [authJwt.verifyToken], controller.getPerson);
  app.delete("/api/lessons/:lessonid", [authJwt.verifyToken], controller.delete);

};
