const db = require("../models");
const Student = db.student;
const { QueryTypes, sequelize } = require('sequelize');

exports.getAll = (req, res) => {

  Student.findAll()
    .then(data => {
      res.status(200).send({
        students: data,
        success: true
      });
    });
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

exports.create = (req, res) => {
  console.log('req--->', req.body.data.values)
  let id = req.body.data.id;
  let values = req.body.data.values;
  let combovalues = req.body.data.combovalues;
  let daysofweekNum = req.body.data.daysofweekNum;
  let groups = req.body.data.groups;
  let textbooks = req.body.data.textbooks;

  const student = {
    firstName: values.firstName,
    lastName: values.lastName,
    IDNumber: values.IDNumber,
    address: values.address,
    notes: values.newnotes,
    startDate: values.startDate,
    endDate: values.endDate,
    maxHours: values.maxHours,
    tel: values.tel,
    tel2: values.tel2,
    classid: combovalues.level,
    languageid: combovalues.language,
    isActive: values.renewing === "undecied" ? 3 : values.renewing === "not_renewing" ? 2 : values.renewing === "renewing" ? 4 : '',
    email: values.email,
    usualHour: '',
    // usualHour: values.lastName,
    price: values.price,
    daysOfWeek: daysofweekNum,
    howdidYouHearid: combovalues.howdidyouhear,
    renewals: values.renewals,
    enrolled: values.enrolled,
    // password: values.lastName,
    password: "$1$0wJt1i4B$v2q64C5J581c2ktN0rqdj0",
    libaccess: values.libaccess ? "Y" : "N",
    libraryAccess: values.libraryAccess ? "Y" : "N",
    hwemail: 3,//
    hwemail: values.lastName,
    emailstatus: 1,
    // emailstatus: values.lastName,
    pending: values.paymentpending ? "Y" : "N",
    postcode: values.postcode,
    toeicaccess: values.toeicaccess ? "Y" : "N",
    birthday: values.birthday,
  };

  Student.update(student, {
    where: { id: id }
  })
    .then(num => {
      console.log('num--->', num)
      if (num == 1) {
        console.log('success--->')
      } else {
        console.log('failed--->')
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Foods with id=" + id
      });
    });
}