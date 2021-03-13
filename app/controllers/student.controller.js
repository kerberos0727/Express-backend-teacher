const db = require("../models");
const Student = db.student;
const { QueryTypes, sequelize } = require('sequelize');
var md5 = require('md5');
var Blob = require('blob');
const { group, textbook } = require("../models");

exports.getAll = async (req, res) => {

  // Student.findAll()
  //   .then(data => {
  //     res.status(200).send({
  //       students: data,
  //       success: true
  //     });
  //   });
  let pagenum = req.params.pagenum;
  let limitnum = req.params.limitnum;
  let total_count = 0;
  await db.sequelize.query("SELECT * FROM students ORDER BY id DESC", { type: QueryTypes.SELECT })
    .then(function (projects) {
      total_count = projects.length;
    })

  await db.sequelize.query("SELECT * FROM students ORDER BY id DESC LIMIT " + pagenum + ", " + limitnum, { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        total: total_count,
        students: projects,
        success: true
      });
    })
};

exports.getPerson = async (req, res) => {
  var id = req.params.userid;
  await db.sequelize.query(`SELECT  SQL_CALC_FOUND_ROWS  students.id, students.firstName, students.lastName, students.IDNumber, students.address, students.email, students.postcode, students.notes, students.startDate, students.pending, students.endDate, students.maxHours, students.usualHour, students.tel, students.tel2, students.isActive, students.price, students.daysOfWeek, students.emailstatus, students.classid, students.libraryAccess, students.libaccess, students.renewals, students.enrolled, students.birthday, students.toeicaccess, howDidYouHear.name AS howDidYouHear, classes.name AS LEVEL, languages.name AS LANGUAGE, recommendations.fromid AS recommendedBy, COALESCE(CONCAT(getRecName.firstName, " ", getRecName.lastName), "") AS recommendedName, COALESCE(recommendations.redeemed2, "Y") AS recRed FROM  students LEFT JOIN classes ON classid = classes.id LEFT JOIN languages ON languageid = languages.id LEFT JOIN howDidYouHear ON howDidYouHearid = howDidYouHear.id LEFT JOIN recommendations ON recommendations.toid = students.id LEFT JOIN students AS getRecName ON getRecName.id = recommendations.fromid WHERE (1 OR 0) AND 1=1 and students.id=${id} ORDER BY students.firstName, students.lastName `, { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        student: projects,
        success: true
      });
    })

};

async function handleupdategroupsstudents(groupid, studentid) {
  // return 'ok';
  console.log('ok--->')
  await db.sequelize.query("INSERT INTO `groupsstudents` (`groupid`, `studentid`) VALUES ('" + groupid + "', '" + studentid + "');", { type: QueryTypes.INSERT })
    .then(function (projects) {
      return res.status(200).send({
        groupsuccess: true
      });
    })
}

exports.update = async (req, res) => {
  // console.log(req.body)
  var cymd = new Date();
  var yy = cymd.getFullYear();
  var mm = cymd.getMonth(+1);
  var dd = cymd.getDate();
  var HH = cymd.getHours();
  var MM = cymd.getMinutes();
  var SS = cymd.getSeconds();
  var ymd = yy + '-' + mm + '-' + dd;
  var ymdhms = yy + '-' + mm + '-' + dd + ' ' + HH + ':' + MM + ':' + SS;

  let userid = req.body.userId;
  let id = req.body.id;
  let values = req.body.values;
  let combovalues = req.body.combovalues;
  let daysofweekNum = req.body.daysofweekNum;
  let groups = req.body.groups;
  let oldgroups = req.body.oldgroups;
  let textbooks = req.body.textbooks;
  let oldtextbooks = req.body.oldtextbooks;
  console.log(combovalues.level)
  const student = {
    firstName: values.firstName,
    lastName: values.lastName,
    IDNumber: values.IDNumber,
    address: values.address,
    notes: values.newnotes,
    startDate: values.startDate.substr(0, 10),
    endDate: values.endDate.substr(0, 10),
    maxHours: values.maxHours,
    tel: values.tel,
    tel2: values.tel2,
    level: combovalues.level,
    languageid: combovalues.language,
    isActive: values.renewing === "undecied" ? 3 : values.renewing === "not_renewing" ? 2 : values.renewing === "renewing" ? 4 : '',
    email: values.email,
    usualHour: null,//
    price: values.price,
    daysOfWeek: daysofweekNum,
    howdidYouHearid: combovalues.howdidyouhear,
    renewals: values.renewals,
    enrolled: values.enrolled.substr(0, 10),
    password: md5('123456'),//
    libaccess: null,
    libraryAccess: values.libraryAccess ? "Y" : "N",
    hwemail: 1,//
    emailstatus: 1,//
    pending: values.paymentpending ? "Y" : "N",
    postcode: values.postcode,
    toeicaccess: values.toeicaccess ? "Y" : "N",
    birthday: values.birthday.substr(0, 10),
  };

  if (student.notes !== '') {
    await db.sequelize.query("INSERT INTO messages SET message = '" + student.notes + "', title = 'Old Notes', userid = '" + userid + "', userType = 1, `dateTime` = '" + ymdhms + "', receiverType = 2, messageType = 0", { type: QueryTypes.INSERT })

    await db.sequelize.query("SELECT * FROM messages WHERE message='" + student.notes + "' AND `dateTime`='" + ymdhms + "'", { type: QueryTypes.SELECT })
      .then(function (res) {
        db.sequelize.query("INSERT INTO notes (messageid, targetTable, targetID) VALUES ('" + res[0].id + "', 'students', '" + id + "')", { type: QueryTypes.INSERT })
      })
  }

  await db.sequelize.query("UPDATE `students` SET `firstName`='" + student.firstName + "',`lastName`='" + student.lastName + "',`IDNumber`='" + student.IDNumber + "',`address`='" + student.address + "',`notes`='" + student.notes + "',`startDate`='" + student.startDate + "',`endDate`='" + student.endDate + "',`maxHours`='" + student.maxHours + "',`tel`='" + student.tel + "',`tel2`='" + student.tel2 + "',`classid`=" + student.level + ",`languageid`=" + student.languageid + ",`isActive`='" + student.isActive + "',`email`='" + student.email + "',`usualHour`='" + student.usealHour + "',`price`='" + student.price + "',`daysOfWeek`=" + daysofweekNum + ",`renewals`='" + student.renewals + "',`enrolled`='" + student.enrolled + "',`password`='" + student.password + "',`libaccess`=" + null + ",`libraryAccess`='" + student.libraryAccess + "',`hwemail`=1,`emailstatus`=1,`pending`='" + student.pending + "',`postcode`='" + student.postcode + "',`toeicaccess`='" + student.toeicaccess + "',`birthday`='" + student.birthday + "' WHERE `id` = " + id + ";", { type: QueryTypes.UPDATE })
    .then(function (responsive) {
      return res.status(200).send({
        success: true
      });
    })

  for (var j = 0; j < oldgroups.length; j++) {
    await db.sequelize.query("DELETE FROM `groupsstudents` WHERE studentid='" + id + "' AND groupid='" + oldgroups[j].id + "';", { type: QueryTypes.DELETE })
  }
  for (var j = 0; j < groups.length; j++) {
    await db.sequelize.query("INSERT INTO `groupsstudents` (`groupid`, `studentid`) VALUES ('" + groups[j].id + "', '" + id + "');", { type: QueryTypes.INSERT })
  }

  for (var j = 0; j < oldtextbooks.length; j++) {
    await db.sequelize.query("DELETE FROM `persontextbooks` WHERE personid='" + id + "' AND textbookid='" + oldtextbooks[j].id + "';", { type: QueryTypes.DELETE })
  }
  for (var j = 0; j < textbooks.length; j++) {
    await db.sequelize.query("INSERT INTO `persontextbooks` (`personid`, `textbookid`, `mark`, `status`, `amount`, `givenDate`) VALUES ('" + id + "', '" + textbooks[j].id + "', '', '1', '1', '" + ymd + "');", { type: QueryTypes.INSERT })
  }
}

exports.create = async (req, res) => {
  var cymd = new Date();
  var yy = cymd.getFullYear();
  var mm = cymd.getMonth(+1);
  var dd = cymd.getDate();
  var HH = cymd.getHours();
  var MM = cymd.getMinutes();
  var SS = cymd.getSeconds();
  var ymd = yy + '-' + mm + '-' + dd;
  var ymdhms = yy + '-' + mm + '-' + dd + ' ' + HH + ':' + MM + ':' + SS;
  let userid = req.body.userId;
  let id = req.body.id;
  let values = req.body.values;
  let combovalues = req.body.combovalues;
  let daysofweekNum = req.body.daysofweekNum;
  let groups = req.body.groups;
  let oldgroups = req.body.oldgroups;
  let textbooks = req.body.textbooks;
  let oldtextbooks = req.body.oldtextbooks;

  const student = {
    firstName: values.firstName,
    lastName: values.lastName,
    IDNumber: values.IDNumber,
    address: values.address,
    notes: values.newnotes,
    startDate: values.startDate.substr(0, 10),
    endDate: values.endDate.substr(0, 10),
    maxHours: values.maxHours,
    tel: values.tel,
    tel2: values.tel2,
    level: combovalues.level,
    languageid: combovalues.language,
    isActive: values.renewing === "undecied" ? 3 : values.renewing === "not_renewing" ? 2 : values.renewing === "renewing" ? 4 : '',
    email: values.email,
    usualHour: null,//
    price: values.price,
    daysOfWeek: daysofweekNum,
    howdidYouHearid: combovalues.howdidyouhear,
    renewals: values.renewals,
    enrolled: values.enrolled.substr(0, 10),
    password: md5('123456'),//
    libaccess: null,
    libraryAccess: values.libraryAccess ? "Y" : "N",
    hwemail: 1,//
    emailstatus: 1,//
    pending: values.paymentpending ? "Y" : "N",
    postcode: values.postcode,
    toeicaccess: values.toeicaccess ? "Y" : "N",
    birthday: values.birthday.substr(0, 10),
  };

  if (student.notes !== '') {
    await db.sequelize.query("INSERT INTO `students` (`firstName`, `lastName`, `IDNumber`, `address`, `notes`, `startDate`, `endDate`, `maxHours`, `tel`, `tel2`, `classid`, `languageid`, `isActive`, `email`, `usualHour`, `price`, `daysOfWeek`, `howDidYouHearid`, `renewals`, `enrolled`, `PASSWORD`, `libaccess`, `libraryAccess`, `hwemail`, `emailstatus`, `pending`, `postcode`, `toeicaccess`, `birthday`) VALUES ('" + student.firstName + "', '" + student.lastName + "', '" + student.IDNumber + "', '" + student.address + "', '" + student.notes + "', '" + student.startDate + "', '" + student.endDate + "', '" + student.maxHours + "', '" + student.tel + "', '" + student.tel2 + "', '" + student.level + "', '" + student.languageid + "', '" + student.isActive + "', '" + student.email + "', '" + student.usualHour + "', '" + student.price + "', '" + student.daysOfWeek + "', '" + student.howdidYouHearid + "', '" + student.renewals + "', '" + student.enrolled + "', '" + student.password + "', NULL, '" + student.libraryAccess + "', '" + student.hwemail + "', '" + student.emailstatus + "', '" + student.pending + "', '" + student.postcode + "', '" + student.toeicaccess + "', '" + student.birthday + "');", { type: QueryTypes.INSERT })

    await db.sequelize.query("INSERT INTO messages SET message = '" + student.notes + "', title = 'Old Notes', userid = '" + userid + "', userType = 1, `dateTime` = '" + ymdhms + "', receiverType = 2, messageType = 0", { type: QueryTypes.INSERT })

    await db.sequelize.query("SELECT * FROM messages WHERE message='" + student.notes + "' AND `dateTime`='" + ymdhms + "'", { type: QueryTypes.SELECT })
      .then(function async(res) {
        console.log(res[0].id)
        db.sequelize.query("INSERT INTO notes (messageid, targetTable, targetID) VALUES ('" + res[0].id + "', 'students', '" + id + "')", { type: QueryTypes.INSERT })
      })
  }

  for (var j = 0; j < oldgroups.length; j++) {
    await db.sequelize.query("DELETE FROM `groupsstudents` WHERE studentid='" + id + "' AND groupid='" + oldgroups[j].id + "';", { type: QueryTypes.DELETE })
  }
  for (var j = 0; j < groups.length; j++) {
    await db.sequelize.query("INSERT INTO `groupsstudents` (`groupid`, `studentid`) VALUES ('" + groups[j].id + "', '" + id + "');", { type: QueryTypes.INSERT })
  }

  for (var j = 0; j < oldtextbooks.length; j++) {
    await db.sequelize.query("DELETE FROM `persontextbooks` WHERE personid='" + id + "' AND textbookid='" + oldtextbooks[j].id + "';", { type: QueryTypes.DELETE })
  }
  for (var j = 0; j < textbooks.length; j++) {
    await db.sequelize.query("INSERT INTO `persontextbooks` (`personid`, `textbookid`, `mark`, `status`, `amount`, `givenDate`) VALUES ('" + id + "', '" + textbooks[j].id + "', '', '1', '1', '" + ymd + "');", { type: QueryTypes.INSERT })
  }
}

exports.delete = async (req, res) => {
  var id = req.params.userid;
  Student.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Student was deleted successfully!",
          success: true
        });
      } else {
        res.send({
          message: `Cannot delete Student with id=${id}. Maybe Student was not found!`,
          success: false
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Student with id=" + id,
        success: false
      });
    });
}
