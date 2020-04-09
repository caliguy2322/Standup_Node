const Team = require("../../models/teamMember");

module.exports = function(router) {
  router.get("/team", function(req, res) {
    Team.find()
      .sort({ name: 1 })
      .exec()
      .then(docs => res.status(200).json(docs))
      .catch(err =>
        res.status(500).json({
          message: "Error finding team members",
          error: err
        })
      );
  });

  router.post("/team", function(req, res) {
    let member = new Team(req.body);
    member.save(function(err, member) {
      if (err) {
        return res.status(400).json(err);
      }
      res.status(200).json(member);
    });
  });
};
