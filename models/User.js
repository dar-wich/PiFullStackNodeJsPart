var mongoose = require('mongoose');
var Schema = mongoose.Schema

var UserSchema = new Schema(
 {
  companyName:{type:String},
  password:    { type: String},
  login:{type:String},
  role:{type:String},
  date:{type:Date}

});

module.exports =  mongoose.model('User', UserSchema);