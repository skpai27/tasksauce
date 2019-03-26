var express = require('express');
var router = express.Router();

var app = express();
var passport = require('passport');
var request = require('request');

const { Pool, Client } = require('pg')
const bcrypt = require('bcrypt') //to store passwords in a hashed format
const LocalStrategy = require('passport-local').Strategy;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

// <<<<<<< HEAD
// var sql_query = 'SELECT password FROM public.users where username=';

// // // GET
// // router.get('/', function(req, res, next) {
// //     res.render('login', { title: 'Login', userData: req.user });
// // });

// // POST (handles login)
// router.post('/', function(req, res, next) {
//     var username = req.body.username_1;
//     var password = req.body.password_1;

//     var check_query = sql_query + "'" + username + "'";

//     pool.query(check_query, (err, data) => {
//         if (err || password !== data.rows[0].password.trim()) {
//             res.redirect('/signuplogin');
//             // TODO: Link directly to Sign In tab, show "Wrong username/password" alert
//             // TODO: Detect invalid username
//         } else {
//             res.redirect('/select');
//         }
//     })
// =======
/* SQL Query */
var sql_query = 'INSERT INTO users VALUES';

//GET
//for now, if user is authed, then go into index page.
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()){
        res.redirect('/select');
    } else {
        res.render('login', { title: 'Login', userData: req.user });
    }
});

//POST (handles login)
router.post('/', passport.authenticate('local', {
    successRedirect: '/select',
    failureRedirect: '/login'
}));

module.exports = router;