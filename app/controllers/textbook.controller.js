const config = require("../config/auth.config");
const db = require("../models");
const Textbook = db.textbook;
const { QueryTypes, sequelize } = require('sequelize');

exports.getAll = (req, res) => {

  Textbook.findAll()
    .then(data => {
      res.status(200).send({
        textbooks: data,
        success: true
      });
    });
};

exports.getPerson = async (req, res) => {
  var id = req.params.userid;
  await db.sequelize.query("SELECT b.id AS `id`, b.name AS name, '' AS pack, a.`givenDate` AS `date`, a.`mark` FROM persontextbooks AS a LEFT JOIN textbooks AS b ON a.`textbookid` = b.`id` WHERE a.`personid` = " + id, { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        textbook: projects,
        success: true
      });
    })
};

exports.getInfoForPerLesson = async (req, res) => {
  var id = req.params.userid;
  console.log('id------------------------------>', id)
  // await db.sequelize.query("SELECT textBookDetails.* , textBooks.name AS textBookName, `from`, `to`, IF(`from`=`to`, `from`, CONCAT(`from`,'-',`to`)) AS pages FROM `textBookDetails` LEFT JOIN textBooks ON textBooks.id = textbookid LEFT JOIN pageRanges ON textBookDetails.id = pageRanges.lessonContentsid WHERE textBookDetails.lessonid = " + id + " ORDER BY id, `from`" + id, { type: QueryTypes.SELECT })
  //   .then(function (projects) {
  //     return res.status(200).send({
  //       textbooks: projects,
  //       success: true
  //     });
  //   })
};


exports.getPerTextbookInfo = async (req, res) => {
  var id = req.params.textbookid;

  Textbook.findAll({ where: { id: id } })
    .then(data => {
      res.status(200).send({
        textbook: data,
        success: true
      });
    })
};