var express = require('express');
var router = express.Router();

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
var sql_query_request = 'SELECT * FROM job_request';
var sql_query_offer = 'SELECT * FROM job_offer';

router.get('/', function(req, res, next) {
	pool.query(sql_query_request, (err, requests) => {
		pool.query(sql_query_offer, (err, offers) => {
			res.render('tasks', { title: 'Tasks', requests: requests.rows, offers: offers.rows });
		})
	});
});

module.exports = router;
