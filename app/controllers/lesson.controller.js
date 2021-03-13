const db = require("../models");
const Lessons = db.lessons;
const { QueryTypes, sequelize } = require('sequelize');

exports.getAll = async (req, res) => {
  let pagenum = req.params.pagenum;
  let limitnum = req.params.limitnum;
  let total_count = 0;
  await db.sequelize.query("SELECT lessons.id, lessonDate, lessons.startTime, lessons.endTime, teachers.name AS teacher, classes.name AS LEVEL FROM lessons LEFT JOIN teachers ON teacherid = teachers.id LEFT JOIN languages ON languageid = languages.id LEFT JOIN classes ON classid = classes.id LEFT JOIN lessonInfo ON lessonInfoid = lessonInfo.id LEFT JOIN groups ON lessons.groupid = groups.id LEFT JOIN rooms ON rooms.id = groups.roomid ORDER BY id DESC", { type: QueryTypes.SELECT })
    .then(function (projects) {
      total_count = projects.length;
    })

  await db.sequelize.query("SELECT lessons.id, lessonDate, lessons.startTime, lessons.endTime, teachers.name AS teacher, classes.name AS LEVEL FROM lessons LEFT JOIN teachers ON teacherid = teachers.id LEFT JOIN languages ON languageid = languages.id LEFT JOIN classes ON classid = classes.id LEFT JOIN lessonInfo ON lessonInfoid = lessonInfo.id LEFT JOIN groups ON lessons.groupid = groups.id LEFT JOIN rooms ON rooms.id = groups.roomid ORDER BY id DESC LIMIT " + pagenum + ", " + limitnum, { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        total: total_count,
        lessons: projects,
        success: true
      });
    })
};


exports.delete = async (req, res) => {
  var id = req.params.lessonid;
  Lessons.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Lesson was deleted successfully!",
          success: true
        });
      } else {
        res.send({
          message: `Cannot delete Lesson with id=${id}. Maybe Lesson was not found!`,
          success: false
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Lesson with id=" + id,
        success: false
      });
    });
}

exports.getPerson = async (req, res) => {
  let lessonid = req.params.lessonid
  await db.sequelize.query(" SELECT lessons.id, lessonDate, lessons.teacherid, lessons.startTime, lessons.endTime, lessons.groupid, teachers.name AS teacher, languages.name AS LANGUAGE, classes.name AS LEVEL, groups.name AS groupName, lessonInfo.name AS lessonInfo, 1 AS isLesson, rooms.name AS actualRoomName, groups.roomid AS actualRoom, topics.`name` AS topics FROM lessons LEFT JOIN teachers ON teacherid = teachers.id LEFT JOIN languages ON languageid = languages.id LEFT JOIN classes ON classid = classes.id LEFT JOIN lessonInfo ON lessonInfoid = lessonInfo.id LEFT JOIN groups ON lessons.groupid = groups.id LEFT JOIN rooms ON rooms.id = groups.roomid LEFT JOIN lessonstopics ON lessonstopics.lessonid = lessons.id LEFT JOIN topics ON lessonstopics.topicid = topics.id WHERE lessons.id='" + lessonid + "'", { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        lesson: projects,
        success: true
      });
    })
}