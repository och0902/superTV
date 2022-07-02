const articleDB = require("../models/articleDB.js");
const ObjectId = require("mongodb").ObjectId;

const output = {

   // main 페이지 표시
   main: function (req, res, next) {
      res.render("main/main", {});
   },

   // article list 표시
   articleList: function (req, res, next) {
      articleDB
         .find()
         .sort({ _id: -1 })
         .then((response) => {
            // console.log('output.articleList에 진입');
            var articles = response;
            articles.forEach(function (article) {
               article.createdDate = dateFormat(article.updatedAt);
            });
            res.render("main/articleList", { articles: articles });
         })
         .catch((error) => {
            res.json({ message: "An error occured !" });
         });
   },

   createArticle: function (req, res, next) {
      res.render("main/createArticle", {});
   },

   // 선택된 article 표시
   showArticle: function (req, res, next) {
      const userID = ObjectId(req.params.id);
      // console.log(userID);
      // console.log("output.showArticle 진입 ~");
      articleDB
         .findOne({ _id: userID })
         .then((response) => {
            let article = response;
            article.createdDate = dateFormat(article.updatedAt);
            // console.log(article);
            res.render('main/showArticle', { article: article });
            // res.json({ response });
         })
         .catch((error) => {
            res.json({ message: 'An error occured !' });
         });
   },

   // 선택된 article update 표시
   updateArticle: function (req, res, next) {
      // console.log('output.updateArticle 진입 ~');
      const userID = ObjectId(req.params.id);
      articleDB
         .findById(userID)
         .then((response) => {
            // res.json({ response });
            let article = response;
            // console.log(article);
            res.render("main/updateArticle", { article: article });
         })
         .catch((error) => {
            res.json({ message: "An error occured !" });
         });
   },

   // 선택된 article 지우기
   deleteArticle: function (req, res, next) {
      // console.log('output.deleteArticle 진입 ~');
      const userID = ObjectId(req.params.id);
      articleDB
         .findByIdAndDelete(userID)
         .then(() => {
            // res.json({ message: 'Employee deleted successfully !' });
            res.redirect("/main/articleList");
         })
         .catch((error) => {
            res.json({ message: "An error occured !" });
         });
   },
   
   saveComment: function (req, res, next) {
      res.redirect("/main/articleList");
   },

   // image blog
   hopeImage: function (req, res, next) {
      res.render("main/hopeImage", {});
   },
};

const process = {
   // article 저장하기
   createArticle: function (req, res, next) {
      // console.log(req.body);
      // console.log(req.body.comments);
      let newArticle = new articleDB({
         title: req.body.title,
         content: req.body.content,
      });
      newArticle
         .save()
         .then(() => {
            // res.json({ message: 'New article added successfully !' });
            res.redirect("/main/articleList");
         })
         .catch((error) => {
            res.json({ message: "An error occured !" });
         });
   },

   // comment 저장하기
   saveComment: function (req, res, next) {
      // console.log("process.saveComment 진입 ~");
      // console.log(req.body);
      articleDB
         .updateOne(
            { _id: ObjectId(req.body.article_id) },
            {
               $push: {
                  comments: {
                     username: req.body.username,
                     comment: req.body.comment,
                  },
               },
            },
            // function (error, article) {
            //    // res.send("Comments are saved successfully ...");
            //    console.log("거의 다 왔어요. 조금만 더 화이팅 ~~");
            //    // res.redirect(`/articles/${req.body.article_id}`);
            //    // res.redirect("/articleList");
            // }
         )
         .then(() => {
            // res.json({ message: "Comment saved successfully !" });
            console.log('Comment saved successfully !');
            // res.redirect('/main/articleList');
            res.redirect(`/main/showArticle/${req.body.article_id}`);
         })
         .catch((error) => {
            res.json({ message: 'An error occured !' });
         });
      // res.redirect('/main/articleList');
   },

   // updated 된 article 저장하기
   updateArticle: function (req, res, next) {
      // console.log('updateArticle의 저장 process 진입 ~');
      var userID = ObjectId(req.params.id);
      let updateData = {
         title: req.body.title,
         content: req.body.content,
      };
      articleDB
         .findByIdAndUpdate(userID, { $set: updateData })
         .then(() => {
            // res.json({ message: 'Employee deleted successfully !' });
            // res.redirect("/articleList");
            res.redirect(`/main/showArticle/${userID}`);
         })
         .catch((error) => {
            res.json({ message: "An error occured !" });
         });
   },
};

function dateFormat(dateBefore) {
   var year = dateBefore.getFullYear();
   var month = ("0" + (dateBefore.getMonth() + 1)).slice(-2);
   var day = ("0" + dateBefore.getDate()).slice(-2);
   var hours = ("0" + dateBefore.getHours()).slice(-2);
   var minutes = ("0" + dateBefore.getMinutes()).slice(-2);
   var dateAfter = year + "." + month + "." + day + " " + hours + ":" + minutes;
   return dateAfter;
}

module.exports = {
   output,
   process,
};
