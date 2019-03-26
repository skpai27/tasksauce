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

// //GET
// //for now, if user is authed, then go into index page.
// router.get('/', function(req, res, next) {
//     if (req.isAuthenticated()){
//         res.redirect('/select');
//     } else {
//         res.render('login', { title: 'Login', userData: req.user });
//     }
// });

//POST (handles login)
router.post('/', passport.authenticate('local', {
    successRedirect: '/select',
    failureRedirect: '/signuplogin'
}));

module.exports = router;