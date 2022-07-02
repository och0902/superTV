var express = require('express');
var router = express.Router();
var passport = require('../config/passport.js');
var util = require('../config/util.js'); 

// main
router.get('/', util.isLoggedIn, function(req, res){
   res.render('main/main');
});

module.exports = router;