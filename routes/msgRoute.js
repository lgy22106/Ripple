module.exports = function(server) {

  var mongoose = require('mongoose')
  , Room = mongoose.model('Room')
  , User = mongoose.model('User')

  var io = require('socket.io').listen(server);

  var clientList = [];

  io.sockets.on('connection', function(socket){
    
    socket.on('message', function(msg) {
      //when server recevies a message
      //emit will send it to everyone else
      io.sockets.emit('message', {
        user: msg.user,
        message: msg.message
      });
    });

    socket.on('joinEvent', function(data) {
      //push socket to clientlist
      clientList[socket.id] = {uId: data.uId,
                               rId: data.rId};


      //while this is doing in the background
      //sockets can already emit the event
      User.load(data.uId, function(err, user) {
        Room.load(data.rId, function(err, room) {
          room.addUser(user);
          user.room = room;
          room.save();
          user.save();
        });

        io.sockets.emit('joinEvent', {
          ip: user.ip,
          id: user._id
        });

      })

    })

    socket.on('disconnect', function() {
      var data = clientList[socket.id];
      delete clientList[socket.id];

      //remove user from room
      User.load(data.uId, function(err, user) {
        Room.load(data.rId, function(err, room) {
          room.removeUser(user);
          user.room = null;
          room.save();
          user.save();
        });

        io.sockets.emit('disconnect', {
          id: user._id
        });

      })

    })

  });

}