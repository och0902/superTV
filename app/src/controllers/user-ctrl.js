'use strict';

const UsersDB = require('../models/users-db.js');

const display = {
   // user list
   users: function(req, res) {
      console.log(`GET /users ${res.statusCode} : users.ejs render 실행`);
      UsersDB.find({}, function(err, users) {
         if(err) return res.json(err);
         res.render('user/users.ejs', { users: users });
      });
   },

   // modify user
   modifyUser: function(req, res) {
      console.log(`GET /user/modify/:id ${res.statusCode} : modify-user.ejs render 실행`);
      UsersDB.findOne({ _id: req.params.id }, function(err, user) {
         if(err) return res.json(err);
         res.render('user/user-modify.ejs', { user: user });
      });
   },
};

const process = {
   // create user
   createUser: function(req, res) {
      console.log(`POST /user/create ${res.statusCode} : create-user process 실행 >> /users 로 redirect 실행`);
      const response = {};
      UsersDB.create(req.body, function(err, user) {
         if(err) {
            response.success = false;
            response.msg = "User 생성에 실패하였습니다.";
            response.err = err;
            return res.json(response);
         };
         response.success = true;
         res.redirect('/users');
         // return res.json(response);
      });

   },

   // update user
   updateUser: function(req, res) {
      console.log(`POST -> PUT  /user/update/:id ${res.statusCode} : update-user process 실행 후 >> /users 로 redirect 실행`);
      UsersDB.findOneAndUpdate( { _id: req.params.id }, req.body, function(err) {
         if(err) return res.json(err);
         res.redirect('/users');
      });
   },

   // destroy user   
   deleteUser: function(req, res) {
      console.log(`POST -> DELETE /admin/delete/:id 304 delete-user process 실행 >> /users 로 redirect 실행`);
      UsersDB.deleteOne({ _id: req.params.id }, function(err) {
         if(err) return res.json(err);
         res.redirect('/users');
      });
   },
};


module.exports = { display, process };