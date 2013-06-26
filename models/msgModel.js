var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var MsgSchema = new Schema({
  msg: {type: String, default: ''},
  user: {type: Schema.ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  room: {type: Schema.ObjectId, ref: 'Room'}
});

mongoose.model('Msg', MsgSchema);
