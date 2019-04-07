const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query_request = sql_query.query.query_request_unbid;
var sql_query_offer = sql_query.query.query_offer_unbid;

router.get('/', function(req, res, next) {
	pool.query(sql_query_request, (err, requests) => {
		if (err) throw err;
		pool.query(sql_query_offer, (err, offers) => {
			if (req.isAuthenticated()) {
				res.render('tasks', { auth: true, title: 'Tasks', requests: requests.rows, offers: offers.rows, req:req });
			} else {
				res.render('tasks', { auth: false, title: 'Tasks', requests: requests.rows, offers: offers.rows, req:req });
			}
		})
	});
});

module.exports = router;
