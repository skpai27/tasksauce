var express = require('express');
var router = express.Router();
const sql_query = require('../sql');

const { Pool } = require('pg')
/* --- V7: Using Dot Env ---
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '********',
  port: 5432,
})
*/
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

var insert_premium = sql_query.query.insert_premium_users;

/* GET premium page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('premium', {auth: true, title: 'Express' });
  } else {
    res.redirect('/signuplogin');
  }
});

router.post('/', function(req, res) {
    pool.query(insert_premium, [req.user.username], (err, res2) => {
        res.redirect('/dashboard');
    })
})

module.exports = router;
