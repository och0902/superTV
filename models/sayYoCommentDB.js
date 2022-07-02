var mongoose = require('mongoose');

// schema
var sayYoCommentSchema = mongoose.Schema({
  sayYo:{type:mongoose.Schema.Types.ObjectId, ref:'sayYo', required:true},
  writer:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
  parentSayYoComment:{type:mongoose.Schema.Types.ObjectId, ref:'sayYoComment'},
  text:{type:String, required:[true,'내용을 입력해 주세요 !']},
  isDeleted:{type:Boolean},
  createdAt:{type:Date, default:Date.now},
  updatedAt:{type:Date},
},{
  toObject:{virtuals:true}
});

sayYoCommentSchema.virtual('childSayYoComments')
  .get(function(){ return this._childSayYoComments; })
  .set(function(value){ this._childSayYoComments=value; });

// model & export
var SayYoComment = mongoose.model('sayYoComment',sayYoCommentSchema);
module.exports = SayYoComment;