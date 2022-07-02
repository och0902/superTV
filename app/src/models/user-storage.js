'use strict';

const UsersDB = require('./users-db.js');

class UsersData {
   static getUserData(clientId) {
      return new Promise( function(resolve, reject) {
         UsersDB.findOne({ id: clientId }, function(err, userData) {
            if(err) reject(`${err}`);
            resolve(userData);
         });
      });
   }

   static saveUserData(clientInfo) {
      return new Promise( function(resolve, reject) {
         UsersDB.create(clientInfo, function(err, user) {
            if(err) reject(`${err}`);
            const response = {};
            response.success = true;
            resolve(response);
         });
      });
   }
}

class User {

   constructor(body) {
      this.body = body;
   }

   async login(req) {
      const client = this.body;
      const response = {};
      try {
         const user = await UsersData.getUserData(client.id);
         req.app.locals.currentUserId = user._id;
         req.app.locals.currentUser = user.id;
         req.session.currentUser = user.id;
         if(user) {
            if(user.id === client.id && user.psword === client.psword) {
               req.session.admin = user.admin;
               req.session.loggedIn = true;
               response.success = true ;
               return response;
            }
            response.success = false;

            req.flash('msg', 'flash msg: 비밀번호가 틀렸습니다 ~~~~');

            response.msg= "비밀번호가 틀렸습니다";
            return response;
         }
         response.success = false;

         req.flash('msg', 'flash msg: 존재하지 않는 아이디입니다 ~~~~');

         response.msg = "존재하지 않는 아이디입니다";
         return response;
      } catch (err) {
         response.success = false;
         response.msg = err;
         return response;
      }
   }

   async register() {
      const client = this.body;
      try {
         const response = await UsersData.saveUserData(client);
         return response;
      } catch (err) {
         const response = {};
         response.success = false;
         response.msg = err;
         return response;
      }

   }

}

module.exports = User;
