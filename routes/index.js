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

/* SQL Query */
var sql_query_request = sql_query.query.query_request_user;
var sql_query_offer = sql_query.query.query_offer_user;

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
		pool.query(sql_query_request, [req.user.username], (err, requests) => {
			pool.query(sql_query_offer, [req.user.username], (err, offers) => {
				if (!err) {
					res.render('dashboard', { title: 'dashboard', requests: requests.rows, offers: offers.rows });
				} else {
					console.log("Sql query failed");
				}
			})
    });  
  } else {
    res.render('index', { title: 'Express' });
  }
});

module.exports = router;
