const config = require("../config/auth.config");
const db = require("../models");
const Groupsstudents = db.groupsstudents;

exports.get_per_group_ids = (req, res) => {
  var id = req.params.userid;
  Groupsstudents.findAll({ where: { studentid: id } })
    .then(data => {
      res.status(200).send({
        groupids: data,
        success: true
      });
    })
    .catch(err => {
      return res.status(404).send({
        success: false
      });
    });
};