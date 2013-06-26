function UserList(container) {
  this.container = container;
}

UserList.prototype.render = function() {
  $('#' + this.container).append()
}


UserList.prototype.add = function(user) {
  $('#' + this.container).append('<div id = ' + user.id + '><span>' + user.id + ' from ' + user.ip + '</span><br></div>')
}

UserList.prototype.remove = function(user) {
  $('#' + user.id).remove();
}