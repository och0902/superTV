var express  = require('express');
var router = express.Router();
var Comment = require('../models/commentDB.js');
var Article = require('../models/articleDB.js');
var util = require('../config/util.js');

// create
router.post('/', util.isLoggedIn, checkArticleId, function(req, res){
   var article = res.locals.article;

   req.body.writer = req.user._id;
   req.body.article = article._id;

   Comment.create(req.body, function(err, comment){
      if(err){
         req.flash('commentError', { _id:null, parentComment:req.body.parentComment, errors:util.parseError(err) });
         req.flash('commentError', { _id:null, errors:util.parseError(err) });
      }
      return res.redirect('/articles/'+article._id+res.locals.getArticleQueryString());
   });
});

// update
router.put('/:id', util.isLoggedIn, checkPermission, checkArticleId, function(req, res){
   var article = res.locals.article;

   req.body.updatedAt = Date.now();
   Comment.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, comment){
      if(err){
         req.flash('commentError', { _id:req.params.id, parentComment:req.body.parentComment, errors:util.parseError(err) });
         req.flash('commentError', { _id:req.params.id, errors:util.parseError(err) });
      }
      return res.redirect('/articles/'+article._id+res.locals.getArticleQueryString());
   });
});

// destroy
router.delete('/:id', util.isLoggedIn, checkPermission, checkArticleId, function(req, res){
   var article = res.locals.article;

   Comment.findOne({_id:req.params.id}, function(err, comment){
      if(err) return res.json(err);

      // save updated comment
      comment.isDeleted = true;
      comment.save(function(err, comment){
         if(err) return res.json(err);

         return res.redirect('/articles/'+article._id+res.locals.getArticleQueryString());
      });
   });
});

module.exports = router;

// private functions

function checkPermission(req, res, next){
   Comment.findOne({_id:req.params.id}, function(err, comment){
      if(err) return res.json(err);
      if(comment.writer != req.user.id) return util.noUserPermission(req, res);
   
      next();
   });
}

function checkArticleId(req, res, next){
   Article.findOne({_id:req.query.articleId}, function(err, article){
      if(err) return res.json(err);

      res.locals.article = article;
      next();
   });
}
