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
var logoutRouter = require('./routes/logout');
var registerRouter = require('./routes/register');
var deletejobRouter = require('./routes/deletejob');
var deletebidRouter = require('./routes/deletebid');
var dashboardRouter = require('./routes/dashboard');
var adminDashboardRouter = require('./routes/adminDashboard');
var leaderboardRouter = require('./routes/leaderboard');
/* ---------------------------- */

/* --- V3: Basic Template   --- */
/* ---------------------------- */
var signuploginRouter = require('./routes/signuplogin');
var tasksRouter = require('./routes/tasks');
var requestsRouter = require('./routes/requests');
var offersRouter = require('./routes/offers');
var newrequestRouter = require('./routes/newrequest');
var newofferRouter = require('./routes/newoffer');
var editrequestRouter = require('./routes/editrequest');
var editofferRouter = require('./routes/editoffer');

/* --- V4: Database Connect --- */
var selectRouter = require('./routes/select');
/* ---------------------------- */

/* --- V6: Modify Database  --- */
var addJobRouter = require('./routes/addJob');
/* ---------------------------- */

var viewRequestJob = require('./routes/viewRequestJob')
var viewOfferJob = require('./routes/viewOfferJob')
var requestInProgress = require('./routes/requestInProgress')
var offerInProgress = require('./routes/offerInProgress')
var requestCompleted = require('./routes/requestCompleted')
var offerCompleted = require('./routes/offerCompleted')
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
app.use('/viewRequestJob', viewRequestJob);
app.use('/viewOfferJob', viewOfferJob);
app.use('/requestInProgress', requestInProgress);
app.use('/offerInProgress', offerInProgress);
app.use('/dashboard', dashboardRouter);
app.use('/adminDashboard', adminDashboardRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);
app.use('/signuplogin', signuploginRouter);
app.use('/deletejob', deletejobRouter);
app.use('/deletebid', deletebidRouter);
app.use('/tasks', tasksRouter);
app.use('/requests', requestsRouter);
app.use('/offers', offersRouter);
app.use('/newrequest', newrequestRouter);
app.use('/newoffer', newofferRouter);
app.use('/editrequest', editrequestRouter);
app.use('/editoffer', editofferRouter);
app.use('/requestCompleted', requestCompleted);
app.use('/offerCompleted', offerCompleted);
app.use('/leaderboard', leaderboardRouter)

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
