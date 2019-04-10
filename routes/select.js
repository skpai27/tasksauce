const sql_query = require('../sql');
var express = require('express');
var router = express.Router();


const { Pool } = require('pg')

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

router.get('/', function(req, res, next) {
	if (req.isAuthenticated()){
		pool.query(sql_query.query.all_requests, (err, data) => {
			res.render('select', { title: 'Database Connect', data: data.rows });
		})
	} else {
		res.redirect('/signuplogin');
	};
});

module.exports = router;
