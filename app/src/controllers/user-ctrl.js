'use strict';

const UsersDB = require('../models/users-db.js');
const bcrypt = require('bcryptjs');

const display = {
   // user list
   users: function(req, res) {
      console.log(`GET /users ${res.statusCode} : users.ejs render 실행`);
      
      UsersDB.find({}, function(err, users) {
         if(err) return res.json(err);
         res.render('user/users.ejs', { users: users, msg: req.flash('msg') });
      });
   },

   // modify user
   modifyUser: function(req, res) {
      console.log(`GET /user/modify/:id ${res.statusCode} : modify-user.ejs render 실행`);

      UsersDB.findOne({ _id: req.params.id }, function(err, user) {
         if(err) return res.json(err);
         res.render('user/user-modify.ejs', { user: user, msg: req.flash('msg') });
      });
   },
};

const process = {
   // create user
   createUser: function(req, res) {
      console.log(`POST /user/create ${res.statusCode} : create-user process 실행 >> /users 로 redirect 실행`);

      req.body.psword = bcrypt.hashSync(req.body.psword);
      UsersDB.create(req.body, function(err, user) {
         if(err) {
            req.flash('msg', 'User 등록에 실패하였습니다');
            return res.json(err);
         };
         req.flash('msg', 'User 등록에 성공하였습니다');
         res.redirect('/users');
      });
   },

   // update user
   updateUser: function(req, res) {
      console.log(`POST -> PUT  /user/update/:id ${res.statusCode} : update-user process 실행 후 >> /users 로 redirect 실행`);

      UsersDB.findOneAndUpdate( { _id: req.params.id }, req.body, function(err) {
         if(err) {
            req.flash('msg', '구성원 정보 수정이 실패하였습니다');
            return res.json(err);
         }
         req.flash('msg', '구성원 정보 수정이 성공적으로 진행되었습니다');
         res.redirect('/users');
      });
   },

   // destroy user   
   deleteUser: function(req, res) {
      console.log(`POST -> DELETE /admin/delete/:id 304 delete-user process 실행 >> /users 로 redirect 실행`);

      UsersDB.deleteOne({ _id: req.params.id }, function(err) {
         if(err) {
            req.flash('msg', '구성원 삭제가 실패하였습니다');
            return res.json(err);
         }
         req.flash('msg', '구성원 삭제가 성공적으로 진행되었습니다');
         res.redirect('/users');
      });
   },
};


module.exports = { display, process };