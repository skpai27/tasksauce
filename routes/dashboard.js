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
var sql_query_request_IP = sql_query.query.query_request_inprog;
var sql_query_offer_IP = sql_query.query.query_offer_inprog;
var sql_query_request_C = sql_query.query.query_request_completed;
var sql_query_offer_C = sql_query.query.query_offer_completed;
var sql_combined_bids = sql_query.query.query_bids_of_user;


/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.isAuthenticated()) {
		pool.query(sql_query_request, [req.user.username], (err, requests) => {
			pool.query(sql_query_offer, [req.user.username], (err1, offers) => {
				pool.query(sql_query_request_IP, [req.user.username], (err2, requestsIP) => {
					pool.query(sql_query_offer_IP, [req.user.username], (err3, offersIP) => {
						pool.query(sql_query_request_C, [req.user.username], (err4, requestC) => {
							pool.query(sql_query_offer_C, [req.user.username], (err5, offersC) => {
								console.log(sql_combined_bids);
								pool.query(sql_combined_bids, [req.user.username], (err6, combinedBids) => {
									if (!err) {
										res.render('dashboard', { auth: true, premium: true, title: 'dashboard', requests: requests.rows, offers: offers.rows, requestsIP: requestsIP.rows, offersIP: offersIP.rows, requestC:requestC.rows, offersC:offersC.rows, combinedBids:combinedBids.rows });
									}
								})
							})
						})
					})
				})
			})
		})
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
