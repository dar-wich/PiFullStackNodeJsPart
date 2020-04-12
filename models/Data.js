var mongoose = require('mongoose');
var Schema = mongoose.Schema

var dataSchema = new Schema(
 {
    id:{type:Number},  
  TweetId: { type: Number },
  userName:    { type: String},
  Date: { type: Date },
  Retweet: { type: String },
  Text: { type: String },
  Geoloc: { type: String },
  textTranslated: { type: String },

});

module.exports =  mongoose.model('Data', dataSchema);