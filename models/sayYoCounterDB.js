var mongoose = require('mongoose');

// schema
var sayYoCounterSchema = mongoose.Schema({
   name:{type:String, required:true},
   count:{type:Number, default:0},
});

// model & export
var SayYoCounter = mongoose.model('sayYoCounter', sayYoCounterSchema);
module.exports = SayYoCounter;