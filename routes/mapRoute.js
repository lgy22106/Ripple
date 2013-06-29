module.exports = function(server) {

  
  var mongoose = require('mongoose')

  var io = require('socket.io').listen(server);

  
  var clientList = {};
  io.sockets.on('connection', function(socket){
    
    socket.on('message', function(data) {

      //when server recevies a message
      //emit will send it to everyone else
      io.sockets.emit('message', {
        id: socket.id,
        message: data.message,
        name: clientList[socket.id].name
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

    socket.on('nameChange', function(data) {
      clientList[socket.id].name = data.name;

    });

    socket.on('disconnect', function() {
      delete clientList[socket.id];

      io.sockets.emit('disconnect', {
        id: socket.id
      });
    })

  });

}

