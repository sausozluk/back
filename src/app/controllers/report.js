var Entry = $('Entry');
var Report = $('Report');

module.exports = {
  create: function (req, res) {
    var entry = req.body.entry;
    var user = req.user_mdl;

    Entry.findOne({id: entry})
      .then(function (entry) {
        if (entry) {
          var report = new Report({user: user._id, entry: entry.id});
          report.save()
            .then(function () {
              res.json({
                success: true
              })
            })
            .then(null, $error(res));
        } else {
          res.json({
            success: false,
            message: "entry yok"
          })
        }
      })
      .then(null, $error(res));
  },
  fetch: function (req, res) {
    Report.find({})
      .populate("user", "username slug")
      .sort({createdAt: -1})
      .then(function (reports) {
        res.json({
          success: true,
          data: reports
        })
      })
      .then(null, $error(res));
  },
  remove: function (req, res) {
    var id = req.params.id;

    Report
      .findOne({id: id})
      .then(function (entry) {
        if (entry) {
          entry.remove();

          res.json({success: true});
        } else {
          res.json({
            success: false,
            message: "böyle bir rapor yok"
          })
        }
      })
      .then(null, $error(res));
  }
};
