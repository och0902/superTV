const mongoose = require('mongoose');

// schema
const commentsSchema = mongoose.Schema({
   article: { type: mongoose.Schema.Types.ObjectId, ref: 'articles', required: true },
   writer: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
   parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'comments' },
   commentContent: { type: String, required: true },
   views: { type: Number, default: 0 },
   goods: { type: Number, default: 0 },
   bads: { type: Number, default: 0 },
   isDeleted: { type: Boolean },
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date }
}, {
   toObject: { virtuals: true }
});

commentsSchema.virtual('childComments')
   .get(function() { return this._childComments; })
   .set(function(value) { this._childComments = value; });


module.exports =  mongoose.model('comments', commentsSchema);