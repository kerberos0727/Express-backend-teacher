const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/textbook.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // app.post(
  //   "/api/textbooks/create",
  //   [
  //     verifySignUp.checkDuplicateUsernameOrEmail,
  //     verifySignUp.checkRolesExisted
  //   ],
  //   controller.create
  // );

  app.get("/api/textbooks/all", [authJwt.verifyToken], controller.getAll);
  app.get("/api/textbooks/:userid", [authJwt.verifyToken], controller.getPerson);
  app.get("/api/textbooks/lesson/:userid", [authJwt.verifyToken], controller.getInfoForPerLesson);
  app.get("/api/textbooks/:textbookid", [authJwt.verifyToken], controller.getPerTextbookInfo);

};
