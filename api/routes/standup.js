const Standup = require("../../models/standup");
const Project = require("../../models/project");
const TeamMember = require("../../models/teamMember");

const mongoose = require("mongoose");

module.exports = function (router) {
  router.get("/standup", function (req, res) {
    Standup.find()
      .sort({ createdOn: 1 })
      .populate("projectId")
      .populate("teamMemberId")
      .exec()
      .then((docs) => res.status(200).json(docs))
      .catch((err) =>
        res.status(500).json({
          message: "Error finding standup meeting notes",
          error: err,
        })
      );
  });

  router.get("/standup/:teamMemberId", function (req, res) {
    const qry = {
      _teamMemberId: mongoose.Types.ObjectId(req.params.teamMemberId),
    };
    Standup.find(qry)
      .sort({ createdOn: 1 })
      .exec()
      .then((docs) => res.status(200).json(docs))
      .catch((err) =>
        res
          .status(500)
          .json({ message: "Error finding standup notes for ", error: err })
      );
  });

  findTeamMember = function (teamMember) {
    const qry = {
      name: teamMember,
    };
    TeamMember.findOne(qry)
      .exec()
      .then(function (result) {
        return result;
      });
  };

  router.put("/standup/:teamMember", function (req, res) {
    const teamMember = findTeamMember(req.params.teamMember).then(function (
      result
    ) {
      const qry = {
        teamMember: req.params.teamMember,
      };
      var update = {
        _teamMemberId: result._id,
      };
      console.log(req.body);
      const doc = Standup.updateOne(qry, update, function (err, doc) {
        if (err) {
          console.log("Something wrong when updating data!", err);
        }
      });
      console.log(doc);
    });
  });

  router.post("/standup", function (req, res) {
    let note = new Standup();
    let project = new Project({
      name: req.body.project,
      description: req.body.project,
    });
    project.save().then((result) => {
      console.log(result);
    });
    let teammember = new TeamMember({ name: req.body.teamMember });
    teammember.save().then((result) => {
      console.log(result);
    });

    note.teamMemberId = teammember;
    note.projectId = project;
    note.teamMember = req.body.teamMember;
    note.project = req.body.project;
    note.workYesterday = req.body.workYesterday;
    note.workToday = req.body.workToday;
    note.impediment = req.body.impediment;
    note.createdOn = req.body.createdOn;
    note.save().then((result) => {
      console.log(result);
    });
    // note
    //   .save()
    //   .then((result) => {
    //     return res.status(200).json(result);
    //   })
    //   .catch((err) => {
    //     return res.status(400).json(err);
    //   });
  });
};
