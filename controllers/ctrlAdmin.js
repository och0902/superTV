const User = require('../models/user.js');
const Admin = require('../models/admin.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var output = {

   // login 페이지 표시
   userLogin: function (req, res, next) {
      res.render("admin/userLogin", {});
   },

   // userRegister 페이지 표시
   userRegister: function (req, res, next) {
      res.render("admin/userRegister", {});
   },

   // adminLogin 페이지 표시
   adminLogin: function (req, res, next) {
      res.render("admin/adminLogin", {});
   },

   // adminRegister 페이지 표시
   adminRegister: function (req, res, next) {
      res.render("admin/adminRegister", {});
   },

};

var process = {

   // userLogin processing
   userLogin: function (req, res, next) {
      // console.log(req.body);
      var email = req.body.email;
      var coNumber = req.body.coNumber;
      var keyNumber = req.body.keyNumber;      
      User.findOne({$and: [{email: email}, {coNumber: coNumber}]})
      .then(user => {
         if(user) {
            bcrypt.compare(keyNumber, user.keyNumber, function(err, result) {
               if(err) {
                  res.json({ error: err });
               };
               if(result) {
                  let token = jwt.sign({email: user.email}, 'superTV-playground.com', {expiresIn: '1h'});
                  // res.json({ message: 'Login successfully !', token: token });
                  res.redirect('/main');
               } else {
                  res.json({ message: 'Password does not matched !' });
               };
            });
         } else {
            res.json ({ message: 'No user found !' });
         };
      });
   },

   // userRegister processing
   userRegister: function (req, res, next) {
      bcrypt.hash(req.body.keyNumber, 10, function(err, hashedKeyNumber) {
         if(err) {
            res.json({ error: err });
         };
         let user = new User ({
            email: req.body.email,
            coNumber: req.body.coNumber,
            // keyNumber: req.body.keyNumber
            keyNumber: hashedKeyNumber
         });
         user.save()
         .then(user => {
            // res.json ({ message: 'User added successfully ! ' });
            res.render("admin/userRegister", {});
         })
         .catch(error => {
            res.json({ message: 'An error occured !' });
         });
      });
   },

   // adminLogin processing
   adminLogin: function (req, res, next) {
      // console.log(req.body);
      var email = req.body.email;
      var coNumber = req.body.coNumber;
      var password = req.body.password;         
      Admin.findOne({$and: [{email: email}, {coNumber: coNumber}]})
      .then(admin => {
         if(admin) {
            bcrypt.compare(password, admin.password, function(err, result) {
               if(err) {
                  res.json({ error: err });
               };
               if(result) {
                  let token = jwt.sign({email: admin.email}, 'superTV-playground.com', {expiresIn: '1h'});
                  // res.json({ message: 'Login successfully !', token: token });
                  res.redirect('userRegister');
               } else {
                  res.json({ message: 'Password does not matched !' });
               };
            });
         } else {
            res.json ({ message: 'No user found !' });
         };
      });
   },

   // adminRegister processing
   adminRegister: function (req, res, next) {
      bcrypt.hash(req.body.password, 10, function(err, hashedPassword) {
         if(err) {
            res.json({ error: err });
         };
         let admin = new Admin ({
            email: req.body.email,
            coNumber: req.body.coNumber,
            password: hashedPassword
         });
         admin.save()
         .then(user => {
            // res.json ({ message: 'Admin added successfully ! ' });
            res.render("admin/adminLogin", {});
         })
         .catch(error => {
            res.json({ message: 'An error occured !' });
         });
      });
   },

}; 

module.exports = { 
   output, process
};
