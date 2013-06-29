module.exports = function(server) {

  
  var mongoose = require('mongoose')

  var io = require('socket.io').listen(server);

  
  var clientList = {};
  io.sockets.on('connection', function(socket){
    
    socket.on('message', function(data) {
      //when server recevies a message
      //emit will send it to everyone else
      io.sockets.emit('message', {
        user: socket.id,
        message: data.message
      });
    });

    socket.on('joinEvent', function(data) {
      //push socket to clientlist
      clientList[socket.id] = {loc : data.loc};

      socket.emit('init',clientList);

      io.sockets.emit('joinEvent', {
        id: socket.id,
        loc: data.loc
      });
      
    });

    

    socket.on('disconnect', function() {
      delete clientList[socket.id];

      io.sockets.emit('disconnect', {
        id: socket.id
      });
    })

  });

}

