const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({ 
   email: String, 
   coNumber: String,
   password: String
}, {timestamps: true} );

const Admin = mongoose.model('Admin', userSchema);
module.exports = Admin;