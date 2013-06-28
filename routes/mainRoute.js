
exports.index = function(req, res) {
  res.render('map/index', {
    uId: req.session.uId
  });
}