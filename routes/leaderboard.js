var express = require('express');
var router = express.Router();
const sql_query = require('../sql');

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});


/* SQL Query */
var sql_query_request_top_offerers = sql_query.query.query_request_top_offerers;


/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.isAuthenticated()) {
		pool.query(sql_query_request_top_offerers, (err, requests) => {
			if (!err) {
                res.render('leaderboard', { title: 'leaderboard', requests: requests.rows});
            }
		});
	} else {
		res.render('signuplogin', { title: 'login'});
	}
});


module.exports = router;
