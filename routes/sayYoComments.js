var express  = require('express');
var router = express.Router();
var SayYoComment = require('../models/sayYoCommentDB.js');
var SayYo = require('../models/sayYoDB.js');
var util = require('../config/util.js');

// create
router.post('/', util.isLoggedIn, checkSayYoId, function(req, res){
   var sayYo = res.locals.sayYo;

   req.body.writer = req.user._id;
   req.body.sayYo = sayYo._id;

   SayYoComment.create(req.body, function(err, sayYoComment){
      if(err){
         req.flash('sayYoCommentForm', {  _id:null, form:req.body  });
         req.flash('sayYoCommentError', { _id:null, parentSayYoComment:req.body.parentSayYoComment, errors:util.parseError(err) });
      }
      return res.redirect('/sayYos/'+sayYo._id+res.locals.getArticleQueryString());
   });
});

// update
router.put('/:id', util.isLoggedIn, checkPermission, checkSayYoId, function(req, res){
   var sayYo = res.locals.sayYo;

   req.body.updatedAt = Date.now();
   SayYoComment.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, sayYoComment){
      if(err){
         req.flash('sayYoCommentForm', { _id:req.params.id, form:req.body });
         req.flash('sayYoCommentError', { _id:req.params.id, parentSayYoComment:req.body.parentSayYoComment, errors:util.parseError(err) });
      }
      return res.redirect('/sayYos/'+sayYo._id+res.locals.getArticleQueryString());
   });
});

// destroy
router.delete('/:id', util.isLoggedIn, checkPermission, checkSayYoId, function(req, res){
   var sayYo = res.locals.sayYo;

   SayYoComment.findOne({_id:req.params.id}, function(err, sayYoComment){
      if(err) return res.json(err);

      // save updated sayYoComment
      sayYoComment.isDeleted = true;
      sayYoComment.save(function(err, sayYoComment){
         if(err) return res.json(err);

         return res.redirect('/sayYos/'+sayYo._id+res.locals.getArticleQueryString());
      });
   });
});

module.exports = router;

// private functions

function checkPermission(req, res, next){
   SayYoComment.findOne({_id:req.params.id}, function(err, sayYoComment){
      if(err) return res.json(err);
      if(sayYoComment.writer != req.user.id) return util.noPermission(req, res);
   
      next();
   });
}

function checkSayYoId(req, res, next){
   SayYo.findOne({_id:req.query.sayYoId}, function(err, sayYo){
      if(err) return res.json(err);

      res.locals.sayYo = sayYo;
      next();
   });
}
