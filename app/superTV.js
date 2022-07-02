'use strict';

// 모듈
const express = require('express');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
require('ejs');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const app = express();

// db setting
mongoose.connect(process.env.MONGO_DB);
const db = mongoose.connection;
autoIncrement.initialize(db);
db.once('open', function() {
   console.log(`MongoDB is successfully connected, ${process.env.MONGO_DB} ...`);
});
db.on('error', function(err) {
   console.log(`MongoDB connection error is occurring, ${err} ...`);
});

// 앱 세팅
app.set('view engine', 'ejs');
app.set('views', './src/views');

// 미들 웨어
app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({ secure: true, secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(flash());

// 라우터
const router = require('./src/routes/router.js');

app.use('/', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
   console.log(`Server is running at http://localhost:${PORT} ...`);
});