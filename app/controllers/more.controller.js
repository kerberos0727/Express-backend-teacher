const db = require("../models");
const Exam = db.exams;
const Scheme = db.schemes;
const Contract = db.contracts;
const { QueryTypes, sequelize } = require('sequelize');

exports.getAll = async (req, res) => {
  let pagenum = req.body.pagenum;
  let limitnum = req.body.limitnum;
  let searchVal = req.body.searchVal;
  let Qeury = "";

  Qeury += "SELECT exams.*, groups.name AS groupname, textbooks.name AS textbookname, COALESCE(teachers.name, 'No teacher') AS teachername, markingschemes.type AS markingtype, markingschemes.name AS markingname, markingschemes.scheme AS markingscheme FROM exams LEFT JOIN groups ON exams.groupid = groups.id LEFT JOIN teachers ON exams.teacherid = teachers.id LEFT JOIN textbooks ON exams.textbookid = textbooks.id LEFT JOIN markingschemes ON markingschemes.id = exams.markingscheme ";
  Qeury += "WHERE 1=1 ";
  if (searchVal.name !== '' && searchVal.name !== undefined)
    Qeury += "AND (groups.name LIKE '%" + searchVal.name + "%' OR textbooks.name LIKE '%" + searchVal.name + "%' OR teachers.name LIKE '%" + searchVal.name + "%' OR exams.name LIKE '" + searchVal.name + "%') ";
  totalQuery = Qeury;
  Qeury += "ORDER BY id DESC  LIMIT " + pagenum + ", " + limitnum;

  await db.sequelize.query(totalQuery, { type: QueryTypes.SELECT })
    .then(function (projects) {
      total_count = projects.length;
    })

  await db.sequelize.query(Qeury, { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        total: total_count,
        results: projects,
        success: true
      });
    })
};

exports.getAllScheme = async (req, res) => {
  let pagenum = req.body.pagenum;
  let limitnum = req.body.limitnum;
  let searchVal = req.body.searchVal;
  let Qeury = "";

  Qeury += "SELECT * FROM `markingschemes` ";
  Qeury += "WHERE 1=1 ";
  if (searchVal.name !== '' && searchVal.name !== undefined)
    Qeury += "AND `name` LIKE '%" + searchVal.name + "%' ";
  totalQuery = Qeury;
  Qeury += "ORDER BY id DESC  LIMIT " + pagenum + ", " + limitnum;

  await db.sequelize.query(totalQuery, { type: QueryTypes.SELECT })
    .then(function (projects) {
      total_count = projects.length;
    })

  await db.sequelize.query(Qeury, { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        total: total_count,
        results: projects,
        success: true
      });
    })
};

exports.delete = async (req, res) => {
  var id = req.params.examid;
  Exam.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Exam was deleted successfully!",
          success: true
        });
      } else {
        res.send({
          message: `Cannot delete Exam with id=${id}. Maybe Exam was not found!`,
          success: false
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Exam with id=" + id,
        success: false
      });
    });
}

exports.deletescheme = async (req, res) => {
  var id = req.params.examid;
  Scheme.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Exam was deleted successfully!",
          success: true
        });
      } else {
        res.send({
          message: `Cannot delete Exam with id=${id}. Maybe Exam was not found!`,
          success: false
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Exam with id=" + id,
        success: false
      });
    });
}

exports.getPerson = async (req, res) => {
  let id = req.params.examid;
  let schedules = [];

  await db.sequelize.query("SELECT examresults.id, examresults.`studentid`, examresults.`examid`, REPLACE(examresults.`results`, ' ','') AS results, examresults.`percent`, exams.type AS examtype, CONCAT(students.firstname, ' ', students.lastname) AS studentname FROM examresults LEFT JOIN students ON examresults.studentid = students.id LEFT JOIN exams ON examresults.examid = exams.id WHERE exams.id=" + id + " ORDER BY exams.id,LENGTH(results) DESC", { type: QueryTypes.SELECT })
    .then(function (projects) {
      schedules = projects
    })

  await db.sequelize.query("SELECT exams.*, groups.name AS groupname, textbooks.name AS textbookname, COALESCE(teachers.name, 'No teacher') AS teachername, markingschemes.type AS markingtype, markingschemes.name AS markingname, markingschemes.scheme AS markingscheme FROM exams LEFT JOIN groups ON exams.groupid = groups.id LEFT JOIN teachers ON exams.teacherid = teachers.id LEFT JOIN textbooks ON exams.textbookid = textbooks.id LEFT JOIN markingschemes ON markingschemes.id = exams.markingscheme WHERE 1=1 AND exams.id=" + id + " ORDER BY id DESC;", { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        result: projects,
        schedules: schedules,
        success: true
      });
    })
};

exports.getPersonscheme = async (req, res) => {
  let id = req.params.examid;

  await db.sequelize.query("SELECT * FROM `markingschemes` WHERE id=" + id, { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        result: projects,
        success: true
      });
    })
};

exports.create = async (req, res) => {
  let data = req.body;
  await db.sequelize.query("INSERT INTO `exams` (`textbookid`, `teacherid`, `type`, `name`, `examDate`, `groupid`, `scheduled`, `markingscheme`) VALUES ('" + data.textbookid + "', '" + data.teacherid + "', '" + data.type + "', '" + data.name + "', '" + data.examDate + "', '" + data.groupid + "', '" + data.scheduled + "', '" + data.markingscheme + "');", { type: QueryTypes.INSERT })
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

exports.update = async (req, res) => {
  let data = req.body;
  await db.sequelize.query("UPDATE `exams` SET `textbookid`=" + data.textbookid + ", `teacherid`=" + data.teacherid + ", `type`=" + data.type + ", `name`='" + data.name + "', `examDate`='" + data.examDate + "', `groupid`=" + data.groupid + ", `scheduled`='" + data.scheduled + "', `markingscheme`=" + data.markingscheme + " WHERE id=" + data.id + ";", { type: QueryTypes.UPDATE })
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

exports.updatescheme = async (req, res) => {
  let data = req.body;
  await db.sequelize.query("UPDATE `markingschemes` SET `name`='" + data.name + "', `type`=" + data.schemeType + ", `scheme`='" + data.scheme + "' WHERE id=" + data.id, { type: QueryTypes.UPDATE })
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

exports.createscheme = async (req, res) => {
  let data = req.body;
  await db.sequelize.query("INSERT INTO `markingschemes` (`name`, `type`, `scheme`) VALUES ('" + data.name + "', '" + data.schemeType + "', '" + data.scheme + "');", { type: QueryTypes.INSERT })
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


exports.getContractAll = async (req, res) => {
  let pagenum = req.body.pagenum;
  let limitnum = req.body.limitnum;
  let searchVal = req.body.searchVal;
  let Qeury = "";

  Qeury += "SELECT a.id, a.name, a.hours, REPLACE(GROUP_CONCAT(ROUND(cents/100,0)),',',' + ') AS cost, ROUND(SUM(cents/100),2)  AS total FROM contracts AS a JOIN contractpayments AS b ON a.id = b.contractid ";
  Qeury += "WHERE 1=1 ";
  if (searchVal.name !== '' && searchVal.name !== undefined)
    Qeury += "AND a.name LIKE '%" + searchVal.name + "%' ";
  totalQuery = "SELECT * FROM contracts;";
  Qeury += "GROUP BY a.id ORDER BY a.id DESC LIMIT " + pagenum + ", " + limitnum;

  await db.sequelize.query(totalQuery, { type: QueryTypes.SELECT })
    .then(function (projects) {
      total_count = projects.length;
    })

  await db.sequelize.query(Qeury, { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        total: total_count,
        contracts: projects,
        success: true
      });
    })
};


exports.deletecontract = async (req, res) => {
  var id = req.params.contractid;
  Contract.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Contract was deleted successfully!",
          success: true
        });
      } else {
        res.send({
          message: `Cannot delete Contract with id=${id}. Maybe Contract was not found!`,
          success: false
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Contract with id=" + id,
        success: false
      });
    });
}

exports.getPersoncontract = async (req, res) => {
  let id = req.params.contractid;

  await db.sequelize.query("SELECT a.id, a.name, a.hours, ROUND(b.cents/100,0) AS cost FROM contracts AS a JOIN contractpayments AS b ON a.id = b.contractid WHERE a.id = " + id, { type: QueryTypes.SELECT })
    .then(function (projects) {
      return res.status(200).send({
        contract: projects,
        success: true
      });
    })
};


exports.createcontract = async (req, res) => {
  let values = req.body.values;
  let payments = req.body.payments;
  let latestId = 0;
  await db.sequelize.query("INSERT INTO contracts SET `name` = '" + values.name + "', hours='" + values.hours + "';", { type: QueryTypes.INSERT })
    .then(reg => {
      return res.status(200).send({
        success: true
      });
    }).catch(err => {
      res.status(500).send({
        success: false
      });
    });
  await db.sequelize.query("SELECT * FROM contracts ORDER BY id DESC;", { type: QueryTypes.SELECT })
    .then(function (projects) {
      latestId = projects[0].id
    })
  for (let i = 0; i < payments.length; i++) {
    await db.sequelize.query("INSERT INTO contractpayments SET contractid = " + latestId + ", paymentorder = " + i + ", cents = " + parseInt(payments[i] + '00') + "", { type: QueryTypes.INSERT })
  }
}

exports.updatecontract = async (req, res) => {
  let id = req.body.id;
  let values = req.body.values;
  let payments = req.body.payments;

  await db.sequelize.query("UPDATE contracts SET `name` = '" + values.name + "' , `hours` = '" + values.hours + "' WHERE `id` = '" + id + "';", { type: QueryTypes.UPDATE })
    .then(reg => {
      return res.status(200).send({
        success: true
      });
    }).catch(err => {
      res.status(500).send({
        success: false
      });
    });
  await db.sequelize.query("DELETE FROM contractpayments WHERE contractid =" + id + ";", { type: QueryTypes.DELETE })

  for (let i = 0; i < payments.length; i++) {
    await db.sequelize.query("INSERT INTO contractpayments SET contractid = " + id + ", paymentorder = " + i + ", cents = " + parseInt(payments[i] + '00') + "", { type: QueryTypes.INSERT })
  }
}
