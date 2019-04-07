var express = require('express');
var router = express.Router();
const sql_query = require('../sql');

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});


/* SQL Query */
var sql_query_request = sql_query.query.query_request_user;
var sql_query_offer = sql_query.query.query_offer_user;
var sql_query_search_request = sql_query.query.query_request_search;
var sql_query_search_offer = sql_query.query.query_offer_search;


/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.isAuthenticated()) {
		pool.query(sql_query_request, [req.user.username], (err, requests) => {
			pool.query(sql_query_offer, [req.user.username], (err, offers) => {
				if (!err) {
					res.render('dashboard', { title: 'dashboard', requests: requests.rows, offers: offers.rows });
				} else {
					console.log("why?!");
				}
			})
		});
	} else {
		res.render('signuplogin', { title: 'login'});
	}
});

/* POST for search */
router.post('/', function(req, res) {
	pool.query(sql_query_search_request, ['%' + req.body.task_search + '%', req.user.username], (err, search) => {
		if (!err) {
			pool.query(sql_query_search_offer, ['%' + req.body.task_search + '%', req.user.username], (err, offers) => {
				if (!err) {
					res.render('dashboard', { title: 'dashboard', requests: search.rows, offers: offers.rows });
				} else {
					console.log(err);
				}
			})
		} else {
			console.log(err)
		}
	});
});

module.exports = router;
