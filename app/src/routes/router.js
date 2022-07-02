'use strict';

const express = require('express');
const router = express.Router();

const welcomeCtrl = require('../controllers/welcome-ctrl.js');
const userCtrl = require('../controllers/user-ctrl.js');
const mainCtrl = require('../controllers/main-ctrl.js');
const articleCtrl = require('../controllers/article-ctrl.js');
const commentCtrl = require('../controllers/comment-ctrl.js');
const auth = require('../config/auth.js');

// welcome page
router.get('/', welcomeCtrl.display.welcome);

router.get('/login', welcomeCtrl.display.welcomeLogin);
router.post('/login', welcomeCtrl.process.welcomeLogin);

router.get('/logout', welcomeCtrl.display.welcomeLogout);

router.get('/register', welcomeCtrl.display.welcomeRegister);
router.post('/register', welcomeCtrl.process.welcomeRegister);

// admin page
router.get('/users', auth.loggedIn, auth.admin, userCtrl.display.users);
router.post('/user/create', auth.loggedIn, auth.admin, userCtrl.process.createUser);
router.get('/user/modify/:id', auth.loggedIn, auth.admin, userCtrl.display.modifyUser);
router.put('/user/update/:id', auth.loggedIn, auth.admin, userCtrl.process.updateUser);
router.delete('/user/delete/:id', auth.loggedIn, auth.admin, userCtrl.process.deleteUser);

// router.get('/users', userCtrl.display.users);
// router.post('/user/create', userCtrl.process.createUser);
// router.get('/user/modify/:id', userCtrl.display.modifyUser);
// router.put('/user/update/:id', userCtrl.process.updateUser);
// router.delete('/user/delete/:id', userCtrl.process.deleteUser);

// main page
router.get('/main', auth.loggedIn, mainCtrl.display.main);

// successHope page
router.get('/successHope', auth.loggedIn, mainCtrl.display.successHope);
router.get('/watch', auth.loggedIn, mainCtrl.display.watch);

// article page
router.get('/articles', auth.loggedIn, articleCtrl.display.articles);
router.get('/article/new', auth.loggedIn, articleCtrl.display.newArticle);
router.post('/article/create', auth.loggedIn, articleCtrl.process.createArticle);
router.get('/article/show/:id', auth.loggedIn, articleCtrl.display.showArticle);
router.get('/article/modify/:id', auth.loggedIn, articleCtrl.display.modifyArticle);
router.put('/article/update/:id', auth.loggedIn, articleCtrl.process.updateArticle);
router.delete('/article/delete/:id', auth.loggedIn, articleCtrl.process.deleteArticle);

// comment page
router.post('/comment/create/:id', auth.loggedIn, articleCtrl.identify.checkArticleId, commentCtrl.process.createComment);
router.put('/comment/update/:id', auth.loggedIn, articleCtrl.identify.checkArticleId, commentCtrl.process.updateComment);
router.delete('/comment/delete/:id', auth.loggedIn, articleCtrl.identify.checkArticleId, commentCtrl.process.deleteComment);

module.exports = router;

