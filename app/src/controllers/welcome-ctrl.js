'use strict';

const UsersDB = require('../models/users-db.js');
const bcrypt = require('bcryptjs');

const display = {

   welcome: function(req, res) {
      console.log(`GET / ${res.statusCode} : welcomel.ejs render 실행`);
      res.render('welcome/welcome.ejs');
   },

   welcomeLogin: function(req, res) {
      console.log(`GET /login ${res.statusCode} : welcomel-login.ejs render 실행`);
      res.render('welcome/welcome-login.ejs');
   },

   welcomeRegister: function(req, res) {
      console.log(`GET /login ${res.statusCode} : welcome-register.ejs render 실행`);
      res.render('welcome/welcome-register.ejs');
   },

   welcomeLogout: function(req, res) {
      console.log(`GET /logout ${res.statusCode} : session destrory 실행 >> / 로 redirect 실행`);
      req.session.destroy( function(err) {
         res.redirect('/');
      });

   }
};

const process = {

   welcomeLogin: async function(req, res) {
      console.log(`POST / ${res.statusCode} : welcome-login process 실행`);
      const client = req.body;      
      UsersDB.findOne({ id: client.id }, function(err, user) {         
         if(err) {
            req.flash('msg', '로그인 중 에러가 발생하셨습니다');
            return res.json(err);
         }
         req.session.currentUser = req.app.locals.currentUser = user.id;
         req.session.currentUserId = user._id;
         if(user) {
            if( client.id === user.id && bcrypt.compareSync(client.psword, user.psword)) {
               req.session.admin = user.admin;
               req.session.loggedIn = true;
               req.flash('msg', '로그인이 성공적으로 진행되었습니다');
               res.redirect('/main');
            } else {
               req.session.loggedIn = false;
               req.flash('msg', '아이디 또는 비밀번호가 틀렸습니다');
               res.redirect('/');
            };
         } else {
            res.session.loggedIn = false;
            req.flash('msg', '존재하지 않는 아이디입니다');
            res.redirect('/');
         };
      }); 
   },
   
   welcomeRegister: async function(req, res) {
      console.log(`POST / ${res.statusCode} : welcome-register process 실행`);
      req.body.psword = bcrypt.hashSync(req.body.psword);
      UsersDB.create(req.body, function(err, user) {
         if(err) {
            req.flash('msg', '구성원 등록 중 에러가 발생하셨습니다');
            return res.json(err);
         }
         req.flash('msg', '구성원 등록이 성공적으로 진행되었습니다');
         res.redirect('/');
      });
   },

};

module.exports = { display, process };