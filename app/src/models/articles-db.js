const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

// DB schema 
const articlesSchema = mongoose.Schema({
   num: { type: Number, default: 0 },
   catagory: { type: String },
   title: { type: String, required: [true, '글의 제목을 입력하여 주세요'] },
   content: { type: String, required: [true, '글의 내용을 입력하여 주세요'] },
   writer: { type: mongoose.Schema.Types.ObjectId, ref:'users', required: true },
   views: { type: Number, default: 0 },
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date },
});

articlesSchema.plugin(autoIncrement.plugin,{
   model: 'articles', 
   field: 'num',
   startAt: 1,
   increment: 1 
});

module.exports = mongoose.model('articles', articlesSchema);