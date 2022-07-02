'use strict';

const auth = {

   loggedIn: function(req, res, next){
      if(req.session.loggedIn) {
         next();
      } else {
         res.redirect('/logout');
      };
   },

   admin: function(req, res, next){
      if(req.session.admin) {
         next();
      } else {
         res.redirect('/logout');
      };
   },

};

module.exports = auth;