const express = require('express');
const router = express.Router();

const ctrlMain = require('../controllers/ctrlMain.js');
// const authenticate = require('../middleware/authenticate.js');

// page rounting

router.get('/', ctrlMain.output.main);
router.get('/articleList', ctrlMain.output.articleList);

router.get('/createArticle', ctrlMain.output.createArticle);
router.post('/createArticle', ctrlMain.process.createArticle);

router.get('/articles/:id', ctrlMain.output.showArticle);

// router.get("/saveComment", ctrlMain.output.showArticle);

router.post('/saveComment', ctrlMain.process.saveComment);

router.get('/showArticle/:id', ctrlMain.output.showArticle);

router.get('/updateArticle/:id', ctrlMain.output.updateArticle);
router.post('/updateArticle/:id', ctrlMain.process.updateArticle);

router.get('/deleteArticle/:id', ctrlMain.output.deleteArticle);

router.get('/hopeImage', ctrlMain.output.hopeImage);

module.exports = router;
