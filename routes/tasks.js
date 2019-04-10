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
var sql_query_request = sql_query.query.query_request_unbid;
var sql_query_offer = sql_query.query.query_offer_unbid;
var is_premium_user = sql_query.query.is_premium_users;

router.get('/', function(req, res, next) {
	pool.query(sql_query_request, (err, requests) => {
		if (err) console.log(sql_query_request);
		pool.query(sql_query_offer, (err, offers) => {
			if (req.isAuthenticated()) {
				pool.query(is_premium_user, [req.user.username], (err, premium) => {

					if (premium.rows.length !== 0) {
						res.render('tasks', { auth: true, premium:true, title: 'Tasks', requests: requests.rows, offers: offers.rows, req:req });
					} else {
						res.render('tasks', { auth: true, premium:false, title: 'Tasks', requests: requests.rows, offers: offers.rows, req:req });
					}
				})
			} else {
				res.render('tasks', { auth: false, premium:false, title: 'Tasks', requests: requests.rows, offers: offers.rows, req:req });
			}
		})
	});
});

module.exports = router;
