const jwt = require('jsonwebtoken');

const authenticate = function(req, res, next) {
   try {
      const token = req.headers.authorization.split(' ')[1];
      const decode = jwt.verify(token, 'superTV-playground.com');

      req.user = decode;
      next();   
   }
   catch(error) {
      res.json ({ message: 'Authentication failed !' });
   };
};

module.exports = authenticate;
