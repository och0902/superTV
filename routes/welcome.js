var express = require('express');
var router = express.Router();
var passport = require('../config/passport.js');
var util = require('../config/util.js'); 

// show welcome page
router.get('/', function(req, res){
   res.render('welcome/welcome');
});

// show userLogin page
router.get('/login', function (req,res) {
   var emailId = req.flash('emailId')[0];
   var errors = req.flash('errors')[0] || {};
   res.render('welcome/userLogin', { emailId: emailId, errors: errors });
});

// process userLogin
router.post('/login', function(req,res,next){
      var errors = {};
      var isValid = true;

      if(!req.body.emailId) { isValid = false; errors.emailId = '아이디를 입력해 주세요 !'; }
      if(!req.body.coNumber) { isValid = false; errors.coNumber = '사번을 입력해 주세요 !'; }

      if(isValid){ next(); }
      else { req.flash('errors',errors); res.redirect('/login'); }
   },
   passport.authenticate('localLogin', {
      successRedirect : '/main',
      failureRedirect : '/login'
   }
));

// process Logout
router.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/');
});

module.exports = router;