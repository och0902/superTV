const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');

const mongoose = require('mongoose');
const createError = require('http-errors');

const adminRouter = require('./routes/admin.js');
const mainRouter = require('./routes/main.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', adminRouter);
app.use('/main', mainRouter);

// app.use( session({ key: 'admin', secret: 'superTV-playground.com', resave: true, saveUninitialized: true }) );

// mongoose setup
mongoose.connect('mongodb://localhost:27017/supertv2108', { useNewUrlParser: true, useUnifiedTopology: true });
const mongoDB = mongoose.connection;
mongoDB.on("error", function (err) { console.log(err); });
mongoDB.once("open", function () { console.log("MongoDB connenction establised ..."); });

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