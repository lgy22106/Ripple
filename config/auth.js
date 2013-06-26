var mongoose = require('mongoose')
  , User = mongoose.model('User')
exports.validateSession = function(req, res, next) {
  if(typeof req.session.uId === 'undefined') {
    //create new user with session containing the user id

    User.create(req.ip, function(err, user) {
      if(err) throw err;
      req.session.uId = user._id;
      next();
    });

  }
  else {
    User.load(req.session.uId, function(err, user) {
      if(typeof user === 'undefined') {
        User.create(req.ip, function(err, user) {
          if(err) throw err;
          req.session.uId = user._id;
          next();
        });
      }
      else {
        next();
      }
    });
  }
  
}