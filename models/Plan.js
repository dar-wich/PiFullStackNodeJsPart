var mongoose = require('mongoose');
var Schema = mongoose.Schema
var obj={
    solution:String,
    date:Date

}
var PlanSchema = new Schema(
 {
  Title:{type:String},
  Description:    { type: String},
  Solutions:{type:[]}

});

module.exports =  mongoose.model('Plan', PlanSchema);