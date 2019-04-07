const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

router.get('/', function(req, res, next) {
	pool.query(sql_query.query.all_requests, (err, requests) => {
		if (err) throw err;
		res.render('requests', { title: 'Requests', requests: requests.rows });
	});
});

module.exports = router;
