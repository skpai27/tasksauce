const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/* SQL Queries */
var sql_query_requests = sql_query.query.all_available_requests;
var sql_query_admin = sql_query.query.is_admin;

router.get('/', function(req, res, next) {
	pool.query(sql_query_requests, (err, requests) => {
		if (err) throw err;
		if (req.isAuthenticated()) {
			pool.query(sql_query_admin, [req.user.username], (err, isAdmin) => {
				if (!err) {
					if (isAdmin.rows[0].is_admin) {
						console.log("Admin [" + req.user.username + "] accessing requests " + isAdmin.rows[0].is_admin);
						res.render('requests', { auth: true, admin: true, title: 'Requests', requests: requests.rows });
					} else {
						res.render('requests', { auth: true, admin: false, title: 'Requests', requests: requests.rows });
					}
				} else {
					console.log("Admin check failed");
				}
			})
		} else {
			res.render('requests', { auth: false, admin: false, title: 'Requests', requests: requests.rows });
		}
	});
});

module.exports = router;
