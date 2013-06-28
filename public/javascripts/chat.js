var socket = io.connect();


//helper functions
function sendMsg() {
  socket.emit('message', {
    user: $('#uId').val(),
    message: $('#msgBox').val()
  })
}

function clearBox() {
  $('#msgBox').val('');
}

function scroll() {
  var obj = document.getElementById('chatWindow');
  obj.scrollTop = obj.scrollHeight;
}
$(function() {

  //init userlist
  var userList = new UserList('userList');

  socket.on('message', function(msg) {
    var html = '<span>' + msg.user + ':' + msg.message + '</span><br>';
    $('#chatWindow').append(html);
    scroll();
  });

  socket.on('joinEvent', function(user) {
    userList.add(user);
  });

  socket.on('disconnect', function(user) {
    userList.remove(user);
  });

  //user joined
  socket.emit('joinEvent', {
    uId: $('#uId').val(),
    rId: $('#rId').val()
  });



  $('#msgBox').keypress(function(e) {
    if(e.which == 13) {
      e.preventDefault();
      sendMsg();
      clearBox();
    }
  });



})