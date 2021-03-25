const db = require("../models");
const Lessons = db.lessons;
const { QueryTypes, sequelize } = require('sequelize');

exports.getAll = async (req, res) => {
  let pagenum = req.params.pagenum;
  let limitnum = req.params.limitnum;
  let total_count = 0;
  await db.sequelize.query("SELECT lessons.id, lessonDate, lessons.teacherid, lessons.startTime, lessons.endTime, lessons.groupid, teachers.name AS teacher, languages.name AS LANGUAGE, classes.name AS LEVEL, groups.name AS groupName, lessoninfo.name AS lessoninfo, 1 AS isLesson, lessons.teacherid AS actualTeacher, rooms.name AS actualRoomName, groups.roomid AS actualRoom, topics.`name` AS topicName  FROM lessons LEFT JOIN teachers ON teacherid = teachers.id LEFT JOIN languages ON languageid = languages.id LEFT JOIN classes ON classid = classes.id LEFT JOIN lessoninfo ON lessoninfoid = lessoninfo.id LEFT JOIN groups ON lessons.groupid = groups.id LEFT JOIN rooms ON rooms.id = groups.roomid LEFT JOIN lessonstopics ON lessonstopics.lessonid = lessons.id LEFT JOIN topics ON lessonstopics.topicid = topics.id ORDER BY lessonDate DESC, startTime DESC, endTime DESC", { type: QueryTypes.SELECT })
    .then(function (projects) {
      total_count = projects.length;
    })

  await db.sequelize.query("SELECT lessons.id, lessonDate, lessons.teacherid, lessons.startTime, lessons.endTime, lessons.groupid, teachers.name AS teacher, languages.name AS LANGUAGE, classes.name AS LEVEL, groups.name AS groupName, lessoninfo.name AS lessoninfo, 1 AS isLesson, lessons.teacherid AS actualTeacher, rooms.name AS actualRoomName, groups.roomid AS actualRoom, topics.`name` AS topicName  FROM lessons LEFT JOIN teachers ON teacherid = teachers.id LEFT JOIN languages ON languageid = languages.id LEFT JOIN classes ON classid = classes.id LEFT JOIN lessoninfo ON lessoninfoid = lessoninfo.id LEFT JOIN groups ON lessons.groupid = groups.id LEFT JOIN rooms ON rooms.id = groups.roomid LEFT JOIN lessonstopics ON lessonstopics.lessonid = lessons.id LEFT JOIN topics ON lessonstopics.topicid = topics.id ORDER BY lessonDate DESC, startTime DESC, endTime DESC LIMIT " + pagenum + ", " + limitnum, { type: QueryTypes.SELECT })
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
  let topicsName = req.params.topicsName
  await db.sequelize.query("SELECT lessons.id, lessonDate, lessons.teacherid, lessons.startTime, lessons.endTime, lessons.groupid, teachers.name AS teacher, languages.name AS LANGUAGE, classes.name AS LEVEL, groups.name AS groupName, lessoninfo.name AS lessoninfo, 1 AS isLesson, lessons.teacherid AS actualTeacher, rooms.name AS actualRoomName, groups.roomid AS actualRoom, topics.name AS topicName  FROM lessons LEFT JOIN teachers ON teacherid = teachers.id LEFT JOIN languages ON languageid = languages.id LEFT JOIN classes ON classid = classes.id LEFT JOIN lessoninfo ON lessoninfoid = lessoninfo.id LEFT JOIN groups ON lessons.groupid = groups.id LEFT JOIN rooms ON rooms.id = groups.roomid LEFT JOIN lessonstopics ON lessonstopics.lessonid = lessons.id LEFT JOIN topics ON lessonstopics.topicid = topics.id where lessons.id='" + lessonid + "' and topics.name='" + topicsName + "' ORDER BY lessonDate DESC, startTime DESC, endTime DESC", { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        lesson: projects,
        success: true
      });
    })
}

exports.Search = async (req, res) => {
  let pagenum = req.body.pagenum;
  let limitnum = req.body.limitnum;
  let searchVals = req.body.searchVals;
  let total_count = 0, totalSql = '';
  let sql = " SELECT lessons.id, lessonDate, lessons.teacherid, lessons.startTime, lessons.endTime, lessons.groupid, teachers.name AS teacher, languages.name AS LANGUAGE, classes.name AS LEVEL, groups.name AS groupName, lessonInfo.name AS lessonInfo, 1 AS isLesson, lessons.teacherid AS actualTeacher, rooms.name AS actualRoomName, groups.roomid AS actualRoom FROM lessons   LEFT JOIN teachers ON teacherid = teachers.id   LEFT JOIN languages ON languageid = languages.id LEFT JOIN classes ON classid = classes.id   LEFT JOIN lessonInfo ON lessonInfoid = lessonInfo.id  LEFT JOIN groups ON lessons.groupid = groups.id LEFT JOIN rooms ON rooms.id = groups.roomid WHERE (1 OR 0) AND 1=1 ";
  if (searchVals.dateFrom)
    sql += "AND lessons.lessonDate >= " + searchVals.dateFrom.substr(0, 10) + " ";
  if (searchVals.dateTo)
    sql += "AND lessons.lessonDate <= " + searchVals.dateTo.substr(0, 10) + " ";
  if (searchVals.teacher)
    sql += "AND teachers.id = '" + searchVals.teacher + "' ";
  if (searchVals.level)
    sql += "AND lessons.classid = '" + searchVals.level + "' ";
  if (searchVals.language)
    sql += "AND lessons.languageid = '" + searchVals.language + "' ";
  if (searchVals.hourFrom)
    sql += "AND lessons.startTime >= " + searchVals.hourFrom + " ";
  if (searchVals.hourTo)
    sql += "AND lessons.endTime <= " + searchVals.hourTo + " ";
  if (searchVals.group)
    sql += "AND lessons.groupid = '" + searchVals.group + "' ";
  if (searchVals.observation)
    sql += "AND lessons.id IN '" + searchVals.observation + "' ";


  sql += "ORDER BY id DESC";
  totalSql = sql;
  sql += " LIMIT " + pagenum + ", " + limitnum

  await db.sequelize.query(totalSql, { type: QueryTypes.SELECT })
    .then(function (projects) {
      total_count = projects.length;
    })

  await db.sequelize.query(sql, { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        total: total_count,
        lessons: projects,
        success: true
      });
    })
};

exports.getInfoForPerLesson = async (req, res) => {
  var id = req.params.lessonid;
  await db.sequelize.query("SELECT textBookDetails.* , textBooks.name AS textBookName, `from`, `to`, IF(`from`=`to`, `from`, CONCAT(`from`,'-',`to`)) AS pages FROM `textBookDetails` LEFT JOIN textBooks ON textBooks.id = textbookid LEFT JOIN pageRanges ON textBookDetails.id = pageRanges.lessonContentsid WHERE textBookDetails.lessonid = " + id + " ORDER BY id, `from`", { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        textbooks: projects,
        success: true
      });
    })
};

exports.getInfoForPerTopics = async (req, res) => {
  var id = req.params.lessonid;
  await db.sequelize.query("SELECT * FROM lessonstopics JOIN topics ON lessonstopics.`topicid` = topics.`id` WHERE lessonid=" + id, { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        topics: projects,
        success: true
      });
    })
};

exports.getInfoForStudent = async (req, res) => {
  var id = req.params.lessonid;
  await db.sequelize.query("SELECT * FROM students AS a JOIN lessonsstudents AS b ON a.id=b.studentid WHERE b.lessonid=" + id, { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        students: projects,
        success: true
      });
    })
};

function maximum(x, y, z) {
  max_val = 0;
  if (x > y) {
    max_val = x;
  } else {
    max_val = y;
  }
  if (z > max_val) {
    max_val = z;
  }
  return max_val;
}

exports.create = async (req, res) => {
  console.log('calling')
}


exports.update = async (req, res) => {
  let lessonid = req.body.id;
  let combovalues = req.body.combovalues;
  let values = req.body.values;
  let students = req.body.students;
  let topics = req.body.topics;
  let textbooks = req.body.textbooks;
  let maxnum = maximum(students.length, topics.length, textbooks.length);
  let lessonsstudentsflag = false, lessonstopicsflag = false, textbookdetailsflag = false, lessonsflag = false;

  for (var j = 0; j < students.length; j++) {
    await db.sequelize.query("DELETE FROM `lessonsstudents` WHERE lessonid='" + lessonid + "' AND studentid='" + students[j].id + "';", { type: QueryTypes.DELETE })
  }
  for (var j = 0; j < students.length; j++) {
    await db.sequelize.query("INSERT INTO `lessonsstudents` (`lessonid`, `studentid`) VALUES ('" + lessonid + "', '" + students[j].id + "');", { type: QueryTypes.INSERT })
      .then(reg => {
        lessonsstudentsflag = true;
      })
  }

  for (var j = 0; j < topics.length; j++) {
    await db.sequelize.query("DELETE FROM `lessonstopics` WHERE lessonid='" + lessonid + "' AND topicid='" + topics[j].id + "';", { type: QueryTypes.DELETE })
  }
  for (var j = 0; j < students.length; j++) {
    await db.sequelize.query("INSERT INTO `lessonstopics` (`lessonid`, `topicid`, `homework`) VALUES ('" + lessonid + "', '" + topics[j].id + "', '" + topics[j].homework + "');", { type: QueryTypes.INSERT })
      .then(reg => {
        lessonstopicsflag = true;
      })
  }

  for (var j = 0; j < textbooks.length; j++) {
    await db.sequelize.query("DELETE FROM `textbookdetails` WHERE lessonid='" + lessonid + "' AND textBookid='" + textbooks[j].textBookid + "';", { type: QueryTypes.DELETE })
  }
  for (var j = 0; j < textbooks.length; j++) {
    await db.sequelize.query("INSERT INTO `textbookdetails` (`lessonid`, `textBookid`, `unit`, `homework`, `exercise`) VALUES ('" + lessonid + "', '" + textbooks[j].textBookid + "', '" + textbooks[j].unit+ "', '" + textbooks[j].homework+ "', '" + textbooks[j].exercise + "');", { type: QueryTypes.UPDATE })
      .then(reg => {
        textbookdetailsflag = true;
      })
  }

  await db.sequelize.query("UPDATE `classid` SET `lessonid`='" + lessonid + "',`startTime`='" + values.startTime.substr(11, values.startTime.length) + "',`endTime`='" + values.endTime.substr(11, values.endTime.length) + "',`lessonDate`='" + values.lessonDate.substr(0, 10) + "',`languageid`='" + combovalues.languageId + "',`teacherid`='" + combovalues.teacherId + "',`groupid`='" + combovalues.levelId + "',`lessonInfoid`='" + combovalues.lessoninfoId + "' WHERE `lessonid` = " + lessonid + ";", { type: QueryTypes.UPDATE })
    .then(reg => {
      return res.status(200).send({
        success: true
      });
    }).catch(err => {
      res.status(500).send({
        success: false
      });
    });
}