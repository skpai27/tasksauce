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
var sql_query_total_top_completers = 'with request_completers as (' + sql_query_request_top_completers + '), offer_completers as (' + sql_query_offer_top_completers + ') SELECT rc.username, rc.count + oc.count as count FROM request_completers rc INNER JOIN offer_completers oc ON rc.username = oc.username';

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.isAuthenticated()) {
		pool.query(sql_query_request_top_offerers, (err, top_offerers) => {
            pool.query(sql_query_total_top_completers, (err1, top_completers) => {
                if (!err) {
                    res.render('leaderboard', { title: 'leaderboard', top_offerers: top_offerers.rows, top_completers: top_completers.rows});
                }
            })
		});
	} else {
		res.render('signuplogin', { title: 'login'});
	}
});


module.exports = router;
