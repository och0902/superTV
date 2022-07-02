var express  = require('express');
var router = express.Router();
var util = require('../config/util.js');

// weTube page
router.get('/', util.isLoggedIn, function(req, res) {
   res.render('weTubes/weTube', { });
});


router.post('/playVideo', util.isLoggedIn, function(req, res) {
   res.render('weTubes/playVideo', { playVideoName: req.body.playVideoName});
});

module.exports = router;