var mongoose = require('mongoose')
  , User = mongoose.model('User')

exports.create = function(req, res, next) {
  var user = new User({ip: req.ip});
  user.save(function(err) {
    if(err) throw err;
    req.user = user;
    next();
  });
}

exports.load = function(req, res, next, uId) {
  User.load(uId, function(err, user) {
    req.user = user;
    next();
  });
}
exports.view = function(req, res) {
  
  // res.render('user/view', {
  //   title: 'view user',
  //   user: req.user
  // });
  res.end(' '+req.user._id);

}

