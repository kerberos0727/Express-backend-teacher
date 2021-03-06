// const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

// const db = {};

// db.mongoose = mongoose;

// db.user = require("./user.model");
// // db.role = require("./role.model");
// // db.address = require("./address.model")
// // db.styles = require("./styles.model")

// db.ROLES = ["site_manager", "administrator", "customer"];

// module.exports = db;

const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  define: {
    timestamps: false
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  options: {
    encrypt: false,
    instancename: 'SQLEXPRESS'
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.student = require("./student.model.js")(sequelize, Sequelize);
db.group = require("./group.model.js")(sequelize, Sequelize);
db.groupsstudents = require("./groupsstudents.model.js")(sequelize, Sequelize);
db.classes = require("./classes.model.js")(sequelize, Sequelize);
db.textbook = require("./textbook.model.js")(sequelize, Sequelize);
db.language = require("./language.model.js")(sequelize, Sequelize);
db.howdidyouhear = require("./howdidyouhear.model.js")(sequelize, Sequelize);
db.bill = require("./bill.model.js")(sequelize, Sequelize);

module.exports = db;