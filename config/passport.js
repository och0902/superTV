var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/userDB.js');

// serialize & deserialize User
passport.serializeUser(function(user, done) {
   done(null, user.id);
});
passport.deserializeUser(function(id, done) {
   User.findOne({_id:id}, function(err, user) {
      done(err, user);
   });
});

// local strategy
passport.use('localLogin',
   new LocalStrategy({
      usernameField : 'emailId',
      passwordField : 'coNumber',
      passReqToCallback : true
   },
   function(req, emailId, coNumber, done) {
      User.findOne({emailId:emailId})
      .select({coNumber:1})
      .exec(function(err, user) {
         if (err) return done(err);

         if (user && user.authenticate(coNumber)){
            return done(null, user);
         }
         else {
            req.flash('emailId', emailId);
            req.flash('errors', {login:'아이디, 사번을 정확하게 입력하여 주십시요 !'});
            return done(null, false);
         }
      });
   })
);

module.exports = passport;