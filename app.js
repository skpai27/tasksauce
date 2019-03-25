var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* --- V7: Using dotenv     --- */
require('dotenv').config({path: __dirname + '/.env'})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');

/* --- V4: Database Connect --- */
var selectRouter = require('./routes/select');
/* ---------------------------- */

/* --- V6: Modify Database  --- */
var addJobRouter = require('./routes/addJob');
/* ---------------------------- */

var viewJob = require('./routes/viewJob')
var app = express();

/* --- Extra stuff for passport js ---*/
var bodyParser = require('body-parser');
var passport = require('passport'); //authentication middleware
var session = require('express-session'); //helps manage everything session-related, incl cookies
const LocalStrategy = require('passport-local').Strategy;


app.use('/static',express.static(path.join(__dirname, 'public')));

// view engine setup
/* --- Extra stuff for passport js ---*/
require('./auth').init(app); //is app needed as a parameter?
app.use(require('cookie-parser')());
app.use(session({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/viewJob',viewJob);

app.use('/login', loginRouter);
app.use('/register', registerRouter);

/* --- Create job page --- */
app.use('/select', selectRouter);
/* ---------------------------- */

/* --- V6: Modify Database  --- */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/addJob', addJobRouter);
/* ---------------------------- */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
