const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const articleSchema = new mongoose.Schema({
   title: String,
   content: String,
   comments: { username: String, comment: String }
}, {timestamps: true} );

const articleDB = mongoose.model('articleDB', articleSchema);

module.exports = articleDB;