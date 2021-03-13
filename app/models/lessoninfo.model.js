module.exports = (sequelize, Sequelize) => {
  const Lessoninfo = sequelize.define("lessoninfo", {
    name: {
      type: Sequelize.STRING
    },
    extra: {
      type: Sequelize.ENUM('Y', 'N')
    }
  });

  return Lessoninfo;
};