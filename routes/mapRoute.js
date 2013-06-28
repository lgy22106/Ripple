module.exports = function(server) {

  
  var mongoose = require('mongoose')
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
      clientList[socket.id] = {uId: data.uId};
      
      io.sockets.emit('joinEvent', {
        id: data.uId,
        loc: data.loc
      });

    })

    // socket.on('disconnect', function() {
    //   var data = clientList[socket.id];
    //   delete clientList[socket.id];

    //     io.sockets.emit('disconnect', {
    //       id: user._id
    //     });
    // })

  });

}

