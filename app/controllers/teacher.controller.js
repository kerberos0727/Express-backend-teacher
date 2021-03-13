const db = require("../models");
const Teacher = db.teacher;
const { QueryTypes, sequelize } = require('sequelize');

exports.getAll = (req, res) => {
  Teacher.findAll()
    .then(data => {
      res.status(200).send({
        teachers: data,
        success: true
      });
    });
};
