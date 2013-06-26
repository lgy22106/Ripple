var mongoose = require('mongoose')
  , Room = mongoose.model('Room')
  , User = mongoose.model('User')


//this method always calls. no matter /room or /room/id
exports.index = function(req, res) {
  res.render('room/index', {
    users: req.users,
    room: req.room,
    uId: req.session.uId
  });
  //req.room exist
  //req.users exist

}

exports.load = function(req, res, next, rId) {

  //next() is the function that pass the request to the next handler. just in case id doesn't exist
  Room.load(rId, function(err, room) {
    //this calls the load function in roomModel
    //it will return a room with the url
    //since we use populate of users, we can access the users as well.
    if(err) res.send(500, {error: 'no idea what err this is'});
    if(room === null) return res.send(404, 'room not found');

    req.room = room;
    req.users = room.users;
    next();
  })
}

exports.assignUser = function(req, res, next) {

  Room.findActive(function(err, rooms) {
    var room = null;
    if(typeof rooms !== 'undefined' && rooms.length > 0) {
      //random generated number
      var num = Math.floor(Math.random()*rooms.length);
      room = rooms[num];
    }
    else {
      //create new room
      room = new Room();
      room.save();
      room.url = room._id;
    }

    req.url = room._id;

    next();


  })
}

exports.redirectUser = function(req, res) {
  res.redirect('/room/' + req.url);
}

// exports.redirectLastRoom = function(req, res) {
//   if(req.session.lastRoom) {
//     res.redirect('/room/' + req.session.lastRoom);
//   }

//   res.redirect('/room');
// }