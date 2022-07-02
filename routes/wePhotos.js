var express  = require('express');
var router = express.Router();
var util = require('../config/util.js');
var fs = require('fs');

// weTube page

router.get('/', util.isLoggedIn, async function(req, res) {
   await fs.readdir('./assets/photos', (err,directories) => {
      if(directories) {
         var photoDir = new Array();
         var photoFiles = [];
         directories.forEach(async function(directory,i) {
            photoDir[i] = directory;
            var Directory= './assets/photos/'+directory;
            // console.log(Directory);
            await fs.readdir(Directory, (err, files) => {
               photoFiles = files;
               // console.log(photoFiles);
            });
            // console.log(JSON.stringify(photoFiles));
         });
         // console.log(photoDir, photoFiles);
      };
   });
   res.render('wePhotos/wePhoto', {fileName: '', directory: ''});
});

router.get('/oledMarcomm', util.isLoggedIn, function(req, res) {
   fs.readdir('./assets/photos/oledMarcomm', (err, files) => {
      res.render('wePhotos/wePhoto', {fileName: files, directory:'oledMarcomm'});
   });
});

router.get('/companyView', util.isLoggedIn, function(req, res) {
   // router.get('/', util.isLoggedIn, function(req, res) {
      fs.readdir('./assets/photos/companyView', (err, files) => {
         res.render('wePhotos/wePhoto', {fileName: files, directory:'companyView'});
      });
   });
   
   router.get('/lgdHistory', util.isLoggedIn, function(req, res) {
      fs.readdir('./assets/photos/lgdHistory', (err, files) => {
         res.render('wePhotos/wePhoto', {fileName: files, directory:'lgdHistory'});
      });
   });

module.exports = router;