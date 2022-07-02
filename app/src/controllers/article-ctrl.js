'use strict';

const ArticlesDB = require('../models/articles-db.js');
const CommentsDB = require('../models/comments-db.js');
const util = require('../config/util.js');

const display = {

   articles: function(req, res) {
      console.log(`GET /article ${res.statusCode} : articles.ejs render 실행`);

      ArticlesDB.find({})
         .sort({ createdAt: -1 })
         .populate('writer')
         .exec( function(err, articles) {
            if(err) return res.json(err);
            res.render('article/articles.ejs', { articles: articles });
         });
   },

   newArticle: function(req, res) {
      console.log(`GET /article/new ${res.statusCode} : new-article.ejs render 실행`);
      res.render('article/new-article.ejs');
   },

   showArticle: function(req, res) {
      console.log(`GET /article/show/:id ${res.statusCode} : show-article.ejs render 실행`);
      Promise.all([
         ArticlesDB.findOne({ _id: req.params.id }).populate({ path: 'writer', select: 'id' }),
         CommentsDB.find({ article: req.params.id }).sort({ createdAt: 1 }).populate({ path: 'writer', select: 'id' })
      ])
      .then( function([article, comments]) {
         if(article.writer.id !== req.session.currentUser) { article.views++; article.save(); };
         let commentTrees = util.convertToTrees(comments, '_id', 'parentComment', 'childComments');   
         res.render('article/show-article.ejs', { article: article, commentTrees: commentTrees });
      })
      .catch( function(err) {
         console.log('err: ', err);
         return res.json(err);
      });
   },

   modifyArticle: function(req, res) {
      console.log(`GET /article/modify/:id ${res.statusCode} : modify-article.ejs render 실행`);
      ArticlesDB.findOne({ _id: req.params.id }, function(err, article) {
         if(err) return res.json(err);
         res.render('article/modify-article.ejs', { article: article, msg: req.flash('msg') });
      });
   },

};

const process = {

   createArticle: function(req, res) {
      console.log(`POST /article/create ${res.statusCode} : create process 실행 >> /articles 로 redirect 실행`);
      req.body.writer = req.session.currentUserId
      ArticlesDB.create(req.body, function(err) {
         if(err)  {
            req.flash('msg', '댓글 등록 중 에러가 발생하였습니다');
            return res.json(err);
         }
         res.redirect('/articles');
      });
   },
   
   updateArticle: function(req, res) {
      console.log(`POST /article/update/:id ${res.statusCode} : update process 실행 >> /article/show/:id 로 redirect 실행`);
      req.body.updatedAt = Date.now();
      ArticlesDB.findOneAndUpdate({ _id: req.params.id }, req.body, function(err) {
         if(err) {
            req.flash('msg', '댓글 수정 중 에러가 발생하였습니다');
            return res.json(err);
         }
         res.redirect(`/article/show/${req.params.id}`);
      });
   },

   deleteArticle: function(req, res) {
      console.log(`GET / ${res.statusCode} : delete process 실행 >> /articles 로 redirect 실행`);
      ArticlesDB.deleteOne({ _id: req.params.id }, function(err) {
         if(err) {
            req.flash('msg', '댓글 삭제 중 에러가 발생하였습니다');
            return res.json(err);
         }
         res.redirect('/articles');
      });
   },

};


const identify = {

   checkArticleId: function(req, res, next) {
      ArticlesDB.findOne({ _id: req.query.articleId }, function(err, article) {
         if(err) return res.json(err);
         req.session.article = article;
         next();
      });
   },

};

module.exports = { display, process, identify };

