const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query_request = sql_query.query.all_available_requests;
var sql_query_offer = sql_query.query.all_available_offers;
var sql_query_admin = sql_query.query.is_admin;
var sql_query_delete_req = sql_query.query.delete_request;

router.get('/', function(req, res, next) {
	pool.query(sql_query_request, (err, requests) => {
		if (err) throw err;
		pool.query(sql_query_offer, (err, offers) => {
			if (req.isAuthenticated()) {
				pool.query(sql_query_admin, [req.user.username], (err, isAdmin) => {
					if (!err) {
						if (isAdmin.rows[0].is_admin) {
							console.log("Admin [" + req.user.username + "] accessing all tasks");
							res.render('tasks', { auth: true, admin: true, title: 'Tasks', requests: requests.rows, offers: offers.rows, req:req });
						} else {
							res.render('tasks', { auth: true, admin: false, title: 'Tasks', requests: requests.rows, offers: offers.rows, req:req });
						}
					} else {
						console.log("Admin check failed");
					}
				})
			} else {
				res.render('tasks', { auth: false, admin: false, title: 'Tasks', requests: requests.rows, offers: offers.rows, req:req });
			}
		})
	});
});

module.exports = router;
