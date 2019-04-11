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
var sql_query_is_admin = sql_query.query.is_admin;
var sql_query_request_IP = sql_query.query.query_request_inprog;
var sql_query_offer_IP = sql_query.query.query_offer_inprog;
var sql_query_request_C = sql_query.query.query_request_completed;
var sql_query_offer_C = sql_query.query.query_offer_completed;
var sql_combined_bids = sql_query.query.query_bids_of_user;

var search_request = sql_query.query.query_request_search;
var search_offer = sql_query.query.query_offer_search;
var search_RIP = sql_query.query.query_requestIP_search;
var search_OIP = sql_query.query.query_offerIP_search;
var search_RC = sql_query.query.query_requestC_search;
var search_OC = sql_query.query.query_offerC_search;


/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.isAuthenticated()) {
		pool.query(sql_query_request, [req.user.username], (err, requests) => {
			pool.query(sql_query_offer, [req.user.username], (err1, offers) => {
				pool.query(sql_query_request_IP, [req.user.username], (err2, requestsIP) => {
					pool.query(sql_query_offer_IP, [req.user.username], (err3, offersIP) => {
						pool.query(sql_query_request_C, [req.user.username], (err4, requestC) => {
							pool.query(sql_query_offer_C, [req.user.username], (err5, offersC) => {
								pool.query(sql_combined_bids, [req.user.username], (err6, combinedBids) => {
									pool.query(sql_query_is_admin, [req.user.username], (err, isAdmin) => {
										if (!err) {
											console.log("Username: " + req.user.username);
											if (isAdmin.rows[0].is_admin == true) {
												console.log("Admin [" + req.user.username + "] authorised");
												res.render('adminDashboard', {auth: true, admin: true, title: 'Admin Dashboard', username: req.user.username, requests: requests.rows, offers: offers.rows, requestsIP: requestsIP.rows, offersIP: offersIP.rows, requestC:requestC.rows, offersC:offersC.rows, combinedBids:combinedBids.rows });
											} else {
												res.render('dashboard', {auth: true, admin: false, title: 'Dashboard', username: req.user.username, requests: requests.rows, offers: offers.rows, requestsIP: requestsIP.rows, offersIP: offersIP.rows, requestC:requestC.rows, offersC:offersC.rows, combinedBids:combinedBids.rows });
											}
										} else {
											console.log("Admin check failed");
											throw err6;
										}
									})
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
	if (req.isAuthenticated()) {
		pool.query(search_request, ['%' + req.body.task_search + '%', req.user.username], (err, requests) => {
			pool.query(search_offer, ['%' + req.body.task_search + '%', req.user.username], (err1, offers) => {
				pool.query(search_RIP, ['%' + req.body.task_search + '%', req.user.username], (err2, requestsIP) => {
					pool.query(search_OIP, ['%' + req.body.task_search + '%', req.user.username], (err3, offersIP) => {
						pool.query(search_RC, ['%' + req.body.task_search + '%', req.user.username], (err4, requestC) => {
							pool.query(search_OC, ['%' + req.body.task_search + '%', req.user.username], (err5, offersC) => {
								console.log(sql_combined_bids);
								pool.query(sql_combined_bids, [req.user.username], (err6, combinedBids) => {
									pool.query(sql_query_is_admin, [req.user.username], (err, isAdmin) => {
										if (!err) {
											console.log("Username: " + req.user.username);
											if (isAdmin.rows[0].is_admin == true) {
												console.log("Admin [" + req.user.username + "] authorised");
												res.render('adminDashboard', {auth: true, admin: true, title: 'Admin Dashboard', username: req.user.username, requests: requests.rows, offers: offers.rows, requestsIP: requestsIP.rows, offersIP: offersIP.rows, requestC:requestC.rows, offersC:offersC.rows, combinedBids:combinedBids.rows });
											} else {
												res.render('dashboard', {auth: true, admin: false, title: 'Dashboard', username: req.user.username, requests: requests.rows, offers: offers.rows, requestsIP: requestsIP.rows, offersIP: offersIP.rows, requestC:requestC.rows, offersC:offersC.rows, combinedBids:combinedBids.rows });
											}
										} else {
											console.log("Admin check failed");
											throw err6;
										}
									})
								})
							})
						})
					})
				})
			})
		})
	} else {
		res.redirect('signuplogin');
	}
});

module.exports = router;
