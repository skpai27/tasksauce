var express = require('express');
var router = express.Router();
const sql_query = require('../sql');

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});


/* SQL Query */
var sql_query_request_top_offerers = sql_query.query.query_request_top_offerers;
var sql_query_request_top_completers = sql_query.query.query_request_top_completers;
var sql_query_offer_top_completers = sql_query.query.query_offer_top_completers;
var sql_query_total_top_completers = 'with request_completers as (' + sql_query_request_top_completers + '), offer_completers as (' + sql_query_offer_top_completers + ') SELECT COALESCE(rc.username, oc.username) AS username, COALESCE(rc.count + oc.count, rc.count, oc.count) as count FROM request_completers rc FULL OUTER JOIN offer_completers oc ON rc.username = oc.username LIMIT 5';

/* GET home page. */
router.get('/', function(req, res, next) {
	pool.query(sql_query_request_top_offerers, (err, top_offerers) => {
		pool.query(sql_query_total_top_completers, (err1, top_completers) => {
			if (!err) {
				if (req.isAuthenticated()) {
					res.render('leaderboard', { auth: true, title: 'leaderboard', top_offerers: top_offerers.rows, top_completers: top_completers.rows});
				} else {
					res.render('leaderboard', { auth: false, title: 'leaderboard', top_offerers: top_offerers.rows, top_completers: top_completers.rows});
				}
			}
		})
	});
});


module.exports = router;
