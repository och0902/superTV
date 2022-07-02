const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/subdocsExample', { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const commentSchema = new Schema({
   username: String, 
   text: String
});

const postSchema = new Schema({
   username: String,
   text: String,
   comments: [commentSchema]
   // comments: [{type: Schema.Types.ObjectId, ref: 'comment'}] 
});

const CommentModel = mongoose.model('comment', commentSchema);

const PostModel = mongoose.model('post', postSchema);

// const aPost = new PostModel({ username: 'Aaron', text: 'Hi there !' });

// const aComment = new CommentModel({ username: 'Bob', text: 'Great Post!' });

// // aComment.save();

// aPost.comments.push(aComment);

// aPost.save((err, data) => {});

PostModel.findOne({})
.populate('comments')
.exec((err, comment) => {
   console.log(comment);
});