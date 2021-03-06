const config = require("../config/auth.config");
const db = require("../models");
const Bill = db.bill;
const { QueryTypes, sequelize } = require('sequelize');

exports.getAll = async (req, res) => {
  await db.sequelize.query("SELECT bills.*, CONCAT_WS(' ', students.firstName, students.lastName) AS student FROM `bills` LEFT JOIN students ON studentID = students.id LEFT JOIN users ON users.id = userID", { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        bills: projects,
        success: true
      });
    })
};
