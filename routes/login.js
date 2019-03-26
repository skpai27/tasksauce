var express = require('express');
var router = express.Router();
const { Pool } = require('pg');

var app = express();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

var sql_query = 'SELECT password FROM public.users where username=';

// // GET
// router.get('/', function(req, res, next) {
//     res.render('login', { title: 'Login', userData: req.user });
// });

// POST (handles login)
router.post('/', function(req, res, next) {
    var username = req.body.username_1;
    var password = req.body.password_1;

    var check_query = sql_query + "'" + username + "'";

    pool.query(check_query, (err, data) => {
        if (err || password !== data.rows[0].password.trim()) {
            res.redirect('/signuplogin');
            // TODO: Link directly to Sign In tab, show "Wrong username/password" alert
            // TODO: Detect invalid username
        } else {
            res.redirect('/select');
        }
    })
});

module.exports = router;