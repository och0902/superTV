const mongoose = require('mongoose');

// DB schema 
const usersSchema = mongoose.Schema({
   name: { type: String },
   id: { type: String, required: true, unique: true },
   psword: { type: String },
   admin: { type: Boolean, default: false }
});

module.exports = mongoose.model('users', usersSchema);