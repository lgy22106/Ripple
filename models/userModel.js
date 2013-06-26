var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var UserSchema = new Schema({
  ip: {type: String, default: ''},
  room: {type: Schema.ObjectId, ref: 'Room'}
});

UserSchema.methods = {
  setRoom: function(room, callback) {
    this.room = room;
    this.save(callback);
  }


}

UserSchema.statics = {
  load: function(uId, callback) {
    this.findOne({_id: uId})
    .exec(callback);
  },

  create: function(ip, callback) {
    var user = new this({ip: ip});
    user.save(callback);
  }
};

mongoose.model('User', UserSchema);
