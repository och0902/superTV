var express  = require('express');
var router = express.Router();
var Article = require('../models/articleDB.js');
var User = require('../models/userDB.js');
var Comment = require('../models/commentDB.js');
var util = require('../config/util.js'); 

// articleList page
router.get('/', util.isLoggedIn, async function(req, res){
   var page = Math.max(1, parseInt(req.query.page));
   var limit = Math.max(1, parseInt(req.query.limit));
   page = !isNaN(page)?page:1;
   limit = !isNaN(limit)?limit:10;
   
   var skip = (page-1)*limit;
   var maxPage = 0;
   var searchQuery = await createSearchQuery(req.query);
   var articles = [];

   if(searchQuery) {
      var count = await Article.countDocuments(searchQuery);
      maxPage = Math.ceil(count/limit);
      articles = await Article.aggregate([
         { $match: searchQuery },
         { $lookup: {
            from: 'users',
            localField: 'writer',
            foreignField: '_id',
            as: 'writer'
         } },
         { $unwind: '$writer' },
         { $sort : { createdAt: -1 } },
         { $skip: skip },
         { $limit: limit },
         { $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'article',
            as: 'comments'
         } },
         { $project: {
            title: 1,
            catagory: 1, 
            writer: {
               emailId: 1,
            },
            views: 1,
            numId: 1,
            createdAt: 1,
            commentCount: { $size: '$comments'}
         } },
         ]).exec();
   }
   res.render('articles/articleList', {
      articles:articles,
      currentPage:page,
      maxPage:maxPage,
      limit:limit,
      searchType:req.query.searchType,
      searchText:req.query.searchText
   });  
});

// New
router.get('/new', util.isLoggedIn, function(req, res){
   var article = req.flash('article')[0] || {};
   var errors = req.flash('errors')[0] || {};
   res.render('articles/newArticle', { article:article, errors:errors });
});

// create
router.post('/', util.isLoggedIn, function(req, res){
   req.body.writer = req.user._id;
   Article.create(req.body, function(err, article){
      if(err){
         req.flash('article', req.body);
         req.flash('errors', util.parseError(err));
         return res.redirect('/articles/new'+res.locals.getArticleQueryString());
      }
      res.redirect('/articles'+res.locals.getArticleQueryString(false, { page:1, searchText:'' }));
   });
});

// show
router.get('/:id', util.isLoggedIn, function(req, res){
   var commentForm = req.flash('commentForm')[0] || {_id: null, form: {}};
   var commentError = req.flash('commentError')[0] || { _id:null, parentComment: null, errors:{}}

   Promise.all([
      Article.findOne({_id:req.params.id}).populate({ path: 'writer', select: 'emailId' }),
      Comment.find({article:req.params.id}).sort('createdAt').populate({ path: 'writer', select: 'emailId' })
   ])
   .then(([article, comments]) => {
      article.views++;
      article.save();
      var commentTrees = util.convertToTrees(comments, '_id','parentComment','childComments');
      res.render('articles/showArticle', { article:article, commentTrees:commentTrees, commentForm:commentForm, commentError:commentError});
   })
   .catch((err) => {
      console.log('err: ', err);
      return res.json(err);
   });
});

// edit
router.get('/:id/edit', util.isLoggedIn, checkPermission, function(req, res){
   var article = req.flash('article')[0];
   var errors = req.flash('errors')[0] || {};
   if(!article){
      Article.findOne({_id:req.params.id}, function(err, article){
         if(err) return res.json(err);
         res.render('articles/editArticle', { article:article, errors:errors });
         });
   }
   else {
      article._id = req.params.id;
      res.render('articles/editArticle', { article:article, errors:errors });
   }
});

// update
router.put('/:id', util.isLoggedIn, checkPermission, function(req, res){
   req.body.updatedAt = Date.now();
   Article.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, article){
      if(err){
         req.flash('article', req.body);
         req.flash('errors', util.parseError(err));
         return res.redirect('/articles/'+req.params.id+'/edit'+res.locals.getArticleQueryString());
      }
      res.redirect('/articles/'+req.params.id+res.locals.getArticleQueryString());
   });
   });

   // destroy
   router.delete('/:id', util.isLoggedIn, checkPermission, function(req, res){
   Article.deleteOne({_id:req.params.id}, function(err){
      if(err) return res.json(err);
      res.redirect('/articles'+res.locals.getArticleQueryString());
   });
});

module.exports = router;

// private functions
function checkPermission(req, res, next){
   Article.findOne({_id:req.params.id}, function(err, article){
      if(err) return res.json(err);
      if(article.writer != req.user.id) return util.noPermission(req, res);

      next();
   });
}

async function createSearchQuery(queries){
   var searchQuery = {};
   if(queries.searchType && queries.searchText && queries.searchText.length >= 3){
      var searchTypes = queries.searchType.toLowerCase().split(',');
      var articleQueries = [];
      if(searchTypes.indexOf('title')>=0){
         articleQueries.push({ title: { $regex: new RegExp(queries.searchText, 'i') } });
      }
      if(searchTypes.indexOf('content')>=0){
         articleQueries.push({ content: { $regex: new RegExp(queries.searchText, 'i') } });
      }
      if(searchTypes.indexOf('writer!')>=0){
         var user = await User.findOne({ emailId: queries.searchText }).exec();
         if(user) articleQueries.push({writer:user._id});
      }
      else if(searchTypes.indexOf('writer')>=0){
         var users = await User.find({ emailId: { $regex: new RegExp(queries.searchText, 'i') } }).exec();
         var userIds = [];
         for(var user of users){
            userIds.push(user._id);
         }
         if(userIds.length>0) articleQueries.push({writer:{$in:userIds}});
      }
      if(articleQueries.length>0) searchQuery = {$or:articleQueries};
      else searchQuery = null;
   }
   return searchQuery;
}
