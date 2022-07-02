'use strict';

const User = require('../models/user-storage.js');

const display = {

   welcome: function(req, res) {
      console.log(`GET / ${res.statusCode} : welcomel.ejs render 실행`);
      // console.log(res);
      res.render('welcome/welcome.ejs');
   },

   welcomeLogin: function(req, res) {
      console.log(`GET /login ${res.statusCode} : welcomel-login.ejs render 실행`);
      // console.log(res);
      res.render('welcome/welcome-login.ejs');
   },

   welcomeRegister: function(req, res) {
      console.log(`GET /login ${res.statusCode} : welcome-register.ejs render 실행`);
      res.render('welcome/welcome-register.ejs');
   },

   welcomeLogout: function(req, res) {
      console.log('GET /logout ${res.statusCode} : session destrory 실행 >> / 로 redirect 실행')
      req.session.destroy( function(err) {
         res.redirect('/');
      });

   }
};

const process = {

   welcomeLogin: async function(req, res) {
      console.log(`POST / ${res.statusCode} : welcome-login process 실행`);
      const user = new User(req.body);
      const response = await user.login(req);
      return res.json(response);
   },
   
   welcomeRegister: async function(req, res) {
      console.log(`POST / ${res.statusCode} : welcome-register process 실행`);
      const user = new User(req.body);
      const response = await user.register();
      return res.json(response);
   },
};

module.exports = { display, process };