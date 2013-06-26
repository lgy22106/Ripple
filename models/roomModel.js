var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var RoomSchema = new Schema({
  url: {type: String},
  users: [
    {type: Schema.ObjectId, ref: 'User'}
  ],
  active: {type: Boolean, default: true}
});

RoomSchema.methods = {
  removeUser: function(uId, callback) {
    this.users.pull(uId);
  },
  addUser: function(uId, callback) {
    this.users.push(uId);
  }
}

RoomSchema.statics = {

  load: function(rId, callback) {
    this.findOne({url: rId})
      .populate('users')
      .exec(callback);
      //populate outputs the list of users that can be used inside the callback
  },

  findActive: function(callback) {
    this.find({active: true})
      .exec(callback);
  }

};


mongoose.model('Room', RoomSchema);
