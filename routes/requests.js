const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/* SQL Queries */
sql_query_requests = sql_query.query.all_available_requests;
sql_query_admin = sql_query.query.is_admin;
sql_query_delete_req = sql_query.query.delete_request;


router.get('/', function(req, res, next) {
	pool.query(sql_query_requests, (err, requests) => {
		if (err) throw err;
		if (req.isAuthenticated()) {
			pool.query(sql_query_admin, [req.user.username], (err, isAdmin) => {
				if (!err) {
					if (isAdmin) {
						console.log("Admin [" + req.user.username + "] accessing requests");
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

/* POST for delete */
router.post('/delete/:jobId', function(req, res, next) {
	// console.log(sql_query_delete_req);
	pool.query(sql_query_delete_req, [req.params.jobId], (err, deletereq) => {
		if (!err) {
			console.log("Successfully deleted Request [jobId: " + req.params.jobId + "]");
		} else {
			console.log("WAZZ GNG ON");
		}
		res.redirect('/requests');
	});
});

module.exports = router;
