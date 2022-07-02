var express  = require('express');
var router = express.Router();
var SayYo = require('../models/sayYoDB.js');
var User = require('../models/userDB.js');
var SayYoComment = require('../models/sayYoCommentDB.js');
var util = require('../config/util.js'); 

// sayYoList page
router.get('/', util.isLoggedIn, async function(req, res){
   var page = Math.max(1, parseInt(req.query.page));
   var limit = Math.max(1, parseInt(req.query.limit));
   page = !isNaN(page)?page:1;
   limit = !isNaN(limit)?limit:10;
   
   var skip = (page-1)*limit;
   var maxPage = 0;
   var searchQuery = await createSearchQuery(req.query);
   var sayYos = [];

   if(searchQuery) {
      var count = await SayYo.countDocuments(searchQuery);
      maxPage = Math.ceil(count/limit);
      sayYos = await SayYo.aggregate([
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
            from: 'sayYoComments',
            localField: '_id',
            foreignField: 'sayYo',
            as: 'sayYoComments'
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
            sayYoCommentCount: { $size: '$sayYoComments'}
         } },
         ]).exec();
   }
   res.render('sayYos/sayYoList', {
      sayYos:sayYos,
      currentPage:page,
      maxPage:maxPage,
      limit:limit,
      searchType:req.query.searchType,
      searchText:req.query.searchText
   });  
});

// New
router.get('/new', util.isLoggedIn, function(req, res){
   var sayYo = req.flash('sayYo')[0] || {};
   var errors = req.flash('errors')[0] || {};
   res.render('sayYos/newSayYo', { sayYo:sayYo, errors:errors });
});

// create
router.post('/', util.isLoggedIn, function(req, res){
   req.body.writer = req.user._id;
   SayYo.create(req.body, function(err, sayYo){
      if(err){
         req.flash('sayYo', req.body);
         req.flash('errors', util.parseError(err));
         return res.redirect('/sayYos/new'+res.locals.getArticleQueryString());
      }
      res.redirect('/sayYos'+res.locals.getArticleQueryString(false, { page:1, searchText:'' }));
   });
});

// show
router.get('/:id', util.isLoggedIn, function(req, res){
   var sayYoCommentForm = req.flash('sayYoCommentForm')[0] || {_id: null, form: {}};
   var sayYoCommentError = req.flash('sayYoCommentError')[0] || { _id:null, parentSayYoComment: null, errors:{}}

   Promise.all([
      SayYo.findOne({_id:req.params.id}).populate({ path: 'writer', select: 'emailId' }),
      SayYoComment.find({sayYo:req.params.id}).sort('createdAt').populate({ path: 'writer', select: 'emailId' })
   ])
   .then(([sayYo, sayYoComments]) => {
      sayYo.views++;
      sayYo.save();
      var sayYoCommentTrees = util.convertToTrees(sayYoComments, '_id','parentSayYoComment','childSayYoComments');
      res.render('sayYos/showSayYo', { sayYo:sayYo, sayYoCommentTrees:sayYoCommentTrees, sayYoCommentForm:sayYoCommentForm, sayYoCommentError:sayYoCommentError});
   })
   .catch((err) => {
      console.log('err: ', err);
      return res.json(err);
   });
});

// edit
router.get('/:id/edit', util.isLoggedIn, checkPermission, function(req, res){
   var sayYo = req.flash('sayYo')[0];
   var errors = req.flash('errors')[0] || {};
   if(!sayYo){
      SayYo.findOne({_id:req.params.id}, function(err, sayYo){
         if(err) return res.json(err);
         res.render('sayYos/editSayYo', { sayYo:sayYo, errors:errors });
         });
   }
   else {
      sayYo._id = req.params.id;
      res.render('sayYos/editSayYo', { sayYo:sayYo, errors:errors });
   }
});

// update
router.put('/:id', util.isLoggedIn, checkPermission, function(req, res){
   req.body.updatedAt = Date.now();
   SayYo.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, sayYo){
      if(err){
         req.flash('sayYo', req.body);
         req.flash('errors', util.parseError(err));
         return res.redirect('/sayYos/'+req.params.id+'/edit'+res.locals.getArticleQueryString());
      }
      res.redirect('/sayYos/'+req.params.id+res.locals.getArticleQueryString());
   });
   });

   // destroy
   router.delete('/:id', util.isLoggedIn, checkPermission, function(req, res){
   SayYo.deleteOne({_id:req.params.id}, function(err){
      if(err) return res.json(err);
      res.redirect('/sayYos'+res.locals.getArticleQueryString());
   });
});

module.exports = router;

// private functions
function checkPermission(req, res, next){
   SayYo.findOne({_id:req.params.id}, function(err, sayYo){
      if(err) return res.json(err);
      if(sayYo.writer != req.user.id) return util.noPermission(req, res);

      next();
   });
}

async function createSearchQuery(queries){
   var searchQuery = {};
   if(queries.searchType && queries.searchText && queries.searchText.length >= 3){
      var searchTypes = queries.searchType.toLowerCase().split(',');
      var sayYoQueries = [];
      if(searchTypes.indexOf('title')>=0){
         sayYoQueries.push({ title: { $regex: new RegExp(queries.searchText, 'i') } });
      }
      if(searchTypes.indexOf('content')>=0){
         sayYoQueries.push({ content: { $regex: new RegExp(queries.searchText, 'i') } });
      }
      if(searchTypes.indexOf('writer!')>=0){
         var user = await User.findOne({ emailId: queries.searchText }).exec();
         if(user) sayYoQueries.push({writer:user._id});
      }
      else if(searchTypes.indexOf('writer')>=0){
         var users = await User.find({ emailId: { $regex: new RegExp(queries.searchText, 'i') } }).exec();
         var userIds = [];
         for(var user of users){
            userIds.push(user._id);
         }
         if(userIds.length>0) sayYoQueries.push({writer:{$in:userIds}});
      }
      if(sayYoQueries.length>0) searchQuery = {$or:sayYoQueries};
      else searchQuery = null;
   }
   return searchQuery;
}
