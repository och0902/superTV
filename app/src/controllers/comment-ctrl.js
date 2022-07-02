'use strict';

const CommentsDB = require('../models/comments-db.js');

const display = {

   modifyComment: function(req, res) {
      console.log(`GET /comment/modify/:id ${res.statusCode} : /article/show/:id 로 redirect 실행`);
      CommentsDB.findOne({ _id: req.params.id }, function(err, comment) {
         if(err) return res.json(err);
         res.redirect(`/article/show/${res.locals.article._id}`);
      });
   },

};

const process = {

   createComment: function(req, res) {
      console.log(`POST /comment/create ${res.statusCode} : create process 실행 >> /article/show/:id 로 redirect 실행`);
      req.body.article = req.query.articleId;
      req.body.writer = req.app.locals.currentUserId;
      CommentsDB.create(req.body, function(err) {
         if(err) return res.json(err);
         res.redirect(`/article/show/${req.query.articleId}`);
      });
   },

   updateComment: function(req, res) {
      console.log(`POST /comment/update/:id ${res.statusCode} : update process 실행 >> /article/show/:id 로 redirect 실행행`);
      // req.body.writer = req.app.locals.currentUserId;
      // req.body.article = res.locals.article._id;
      req.body.updatedAt = Date.now();
      CommentsDB.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, comment) {
         if(err) return res.json(err);
         res.redirect(`/article/show/${req.query.articleId}`);
      });
   },

   deleteComment: function(req, res) {
      console.log(`GET / ${res.statusCode} : delete process 실행 >> /article/show/:id 로 redirect 실행`);
      CommentsDB.deleteOne({ _id: req.params.id }, function(err) {
         if(err) return res.json(err);
         res.redirect(`/article/show/${res.locals.article._id}`);
      });
   },

};

module.exports = { display, process };

