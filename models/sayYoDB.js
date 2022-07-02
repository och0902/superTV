var mongoose = require('mongoose');
var Counter = require('./sayYoCounterDB.js');

// schema
var sayYoSchema = mongoose.Schema({
   numId:{type:Number},
   category:{type:String},
   title:{type:String, required:[true,'제목을 입력해 주세요 !']},
   content:{type:String, required:[true,'내용을 입력해 주세요 !']},
   writer:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
   views:{type:Number, default:0},
   createdAt:{type:Date, default:Date.now},
   updatedAt:{type:Date},
});

sayYoSchema.pre('save', async function (next){
   var sayYo = this;
   if(sayYo.isNew){
      counter = await Counter.findOne({name:'sayYos'}).exec();
      if(!counter) counter = await Counter.create({name:'sayYos'});
      counter.count++;
      counter.save();
      sayYo.numId = counter.count;
   }
   return next();
});

// model & export
var SayYo = mongoose.model('sayYo', sayYoSchema);
module.exports = SayYo;