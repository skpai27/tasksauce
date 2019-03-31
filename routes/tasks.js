const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

router.get('/', function(req, res, next) {
	pool.query(sql_query.query.all_requests, (err, requests) => {
		console.log("Executing " + sql_query.query.all_requests);
		pool.query(sql_query.query.all_offers, (err, offers) => {
			console.log("Executing " + sql_query.query.all_offers);
			res.render('tasks', { title: 'Tasks', requests: requests.rows, offers: offers.rows });
		})
	});
});

module.exports = router;
