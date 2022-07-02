var express = require('express');
var app = express();
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('./config/passport.js');
var flash = require('connect-flash');
var util = require('./config/util.js');
var dotenv = require('dotenv');
dotenv.config();
var createError = require('http-errors');

// DB setting
mongoose.connect(process.env.MONGODB, 
   { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true });
var mongoDB = mongoose.connection;
mongoDB.once('open', function () { console.log('MongoDB connenction establised ...'); });
mongoDB.on('error', function(err){ console.log('MongoDB ERROR : ', err); });

// view engine setup
app.set('view engine', 'ejs');

// Other settings
app.use(logger('dev'));
app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({secret:'supreTV-playground.com', resave:true, saveUninitialized:true}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares
app.use(function(req,res,next){
   res.locals.isAuthenticated = req.isAuthenticated();
   res.locals.currentUser = req.user;
   res.locals.currentAdmin = req.admin;
   next();
});

// Routes
app.use('/', require('./routes/welcome.js'));
app.use('/users', require('./routes/users.js'));
app.use('/main', require('./routes/main.js'));

app.use('/articles', util.getArticleQueryString, require('./routes/articles.js'));
app.use('/comments', util.getArticleQueryString, require('./routes/comments.js'));

app.use('/weTubes', util.getArticleQueryString, require('./routes/weTubes.js'));
app.use('/wePhotos', util.getArticleQueryString, require('./routes/wePhotos.js'));

app.use('/sayYos', util.getArticleQueryString, require('./routes/sayYos.js'));
app.use('/sayYoComments', util.getArticleQueryString, require('./routes/sayYoComments.js'));

// catch 404 and forward to error handler
app.use(function (req, res, next) { next(createError(404)); });

// error handler
app.use(function (err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render('error');
});

module.exports = app;