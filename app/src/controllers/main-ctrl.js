'use strict';

const display = {
   
   main: function(req, res) {
      console.log(`GET /main ${res.statusCode} : main.ejs render 실행`);
      res.render('main/main.ejs');       
   },

   successHope: function(req, res) {
      console.log(`GET /successHope ${res.statusCode} : successHope.ejs render 실행`);
      res.render('main/successHope.ejs');
   },

   watch: function(req, res) {
      console.log(`GET /main/watch ${res.statusCode} : watch.ejs render 실행`);
      res.render('main/watch.ejs', { video: req.query.v });
   },
   
};

const process = {

};

module.exports = { display, process };