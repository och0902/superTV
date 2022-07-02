var express = require('express');
var router = express.Router();
var User = require('../models/userDB.js');
var util = require('../config/util.js'); 

// userList
router.get('/', util.isLoggedIn, checkAdmin, function(req, res){
// router.get('/', function(req, res){
   User.find({})
      .sort({emailId:1})
      .exec(function(err, users){
         if(err) return res.json(err);
         res.render('users/userList', { users:users });
      });
});

// New
router.get('/new', util.isLoggedIn, checkAdmin, function(req, res){
// router.get('/new', function(req, res){
   var user = req.flash('user')[0] || {};
   var errors = req.flash('errors')[0] || {};
   res.render('users/newUser', { user:user, errors:errors });
});

// create
router.post('/', util.isLoggedIn, checkAdmin, function(req, res){
// router.post('/', function(req, res){
   User.create(req.body, function(err, user){
      if(err){
         req.flash('user', req.body);
         req.flash('errors', util.parseError(err));
         return res.redirect('/users/new');
      }
      res.redirect('/users');
   });
});

// show
router.get('/:emailId', util.isLoggedIn, checkAdmin, function(req, res){
// router.get('/:emailId', function(req, res){
   User.findOne({emailId:req.params.emailId}, function(err, user){
      if(err) return res.json(err);
      res.render('users/showUser', {user:user});
   });
});

// destroy
router.delete('/:emailId', util.isLoggedIn, checkAdmin, function(req, res){
// router.delete('/:emailId', function(req, res){
   User.deleteOne({emailId:req.params.emailId}, function(err){
      if(err) return res.json(err);
      res.redirect('/users');
   });
});

module.exports = router;

// functions
function parseError(errors){
   var parsed = {};
   if(errors.name == 'ValidationError'){
      for(var name in errors.errors){
         var validationError = errors.errors[name];
         parsed[name] = { message:validationError.message };
      }
   }
   else if(errors.code == '11000' && errors.errmsg.indexOf('emailId') > 0) {
      parsed.emailId = { message:'This emailId already exists!' };
   }
   else {
      parsed.unhandled = JSON.stringify(errors);
   }
   return parsed;
}

function checkPermission(req, res, next){
   User.findOne({emailId:req.params.emailId}, function(err, user){
      if(err) return res.json(err);
      if(user.id != req.user.id) return util.noPermission(req, res);
      next();
   });
}

function checkAdmin(req, res, next){
   if(!req.user.isAdmin) return util.noPermission(req, res);
   next();

}