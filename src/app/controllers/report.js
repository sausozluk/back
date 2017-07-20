var Entry = $('Entry');
var Report = $('Report');

module.exports = {
  create: function (req, res) {
    var entry = req.body.entry;
    var user = req.user_mdl;

    Entry.findOne({id: entry})
      .then(function (entry) {
        if (entry) {
          var report = new Report({username: user.username, entry: entry.id});
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
      .sort({createdAt: -1})
      .then(function (reports) {
        res.json({
          success: true,
          data: reports
        })
      })
      .then(null, $error(res));
  }
};
