const db = require("../models");
const Group = db.group;
const { QueryTypes, sequelize } = require('sequelize');


exports.getAll = (req, res) => {
  Group.findAll()
    .then(data => {
      res.status(200).send({
        groups: data,
        success: true
      });
    });
};

exports.getPersongroup = (req, res) => {
  console.log('alsdfahskdjlfhalskd')
  var id = req.params.groupid;
  Group.findByPk(id)
    .then(data => {
      res.status(200).send({
        group: data,
        success: true
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Group with id=" + id
      });
    });
};

exports.getCustomgroup = async (req, res) => {
  await db.sequelize.query("SELECT groups.id, groups.teacherid, groups.roomid, groups.daysInt, groups.groupstatus, groups.name, groups.time, groups.endTime, groups.unit, textbooks.midPoint AS textbookMidPoint, textbooks.nearMid AS textbookNearMid, textbooks.nearEnd AS textbookNearEnd,textbooks.id AS textbookid, textbooks.name AS textbook, rooms.name AS newRoom, classes.name AS LEVEL, teachers.name AS teacher FROM groupsstudents, `groups` LEFT JOIN classes ON groups.levelid = classes.id LEFT JOIN teachers ON groups.teacherid = teachers.id LEFT JOIN textbooks ON groups.textbookid = textbooks.id LEFT JOIN rooms ON groups.roomid = rooms.id", { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        groups: projects,
        success: true
      });
    })
};