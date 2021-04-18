const controller = require("../controllers/more.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/more/exams/all", [authJwt.verifyToken], controller.getAll);
  app.post("/api/more/exams/scheme/all", [authJwt.verifyToken], controller.getAllScheme);
  app.get("/api/more/exams/:examid", [authJwt.verifyToken], controller.getPerson);
  app.get("/api/more/exams/scheme/:examid", [authJwt.verifyToken], controller.getPersonscheme);
  app.put("/api/more/exams/scheme/update", [authJwt.verifyToken], controller.updatescheme);
  app.put("/api/more/exams/update", [authJwt.verifyToken], controller.update);
  app.post("/api/more/exams/scheme/create", [authJwt.verifyToken], controller.createscheme);
  app.delete("/api/more/exams/:examid", [authJwt.verifyToken], controller.delete);
  app.delete("/api/more/exams/scheme/:examid", [authJwt.verifyToken], controller.deletescheme);

};
