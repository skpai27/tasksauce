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

//POST (handles logout)
router.get('/', function(req, res, next) {
	req.session.destroy()
    req.logout()
    console.log("logout activated");
	res.redirect('/')
});

module.exports = router;