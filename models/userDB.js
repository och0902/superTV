var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// schema
var userSchema = mongoose.Schema({
   name:{
      type:String,
      required:[true,'이름을 입력하여 주세요 !'],
      trim:true
   },
   emailId:{
      type:String,
      required:[true,'아이디를 입력하여 주세요 !'],
      trim:true,
      unique:true
   },
   coNumber:{
      type:String,
      required:[true,'사번을 입력하여 주세요 !']
   },
   isAdmin:{type:Boolean, default:false},
   },{ toObject:{virtuals:true} }
);

// virtuals
userSchema.virtual('newCoNumber')
   .get(function(){ return this._newCoNumber; })
   .set(function(value){ this._newCoNumber=value; });

// hash coNumber
userSchema.pre('save', function (next){
   var user = this;
   if(!user.isModified('coNumber')){
      return next();
   }
   else {
      user.coNumber = bcrypt.hashSync(user.coNumber);
      return next();
   }
});

// model methods
userSchema.methods.authenticate = function (coNumber) {
   var user = this;
   return bcrypt.compareSync(coNumber,user.coNumber);
};

// model & export
var User = mongoose.model('user',userSchema);
module.exports = User;