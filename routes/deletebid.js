const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/* SQL Queries */
var sql_query_delete_req_bid = sql_query.query.delete_request_bid;
var sql_query_delete_off_bid = sql_query.query.delete_offer_bid;

/* POST for delete requests */
router.post('/req/:jobId/:bidId', function(req, res, next) {
	console.log(req.params);
	pool.query(sql_query_delete_req_bid, [req.params.bidId], (err) => {
		if (!err) {
			console.log("Successfully deleted Request bid [bidId: " + req.params.bidId + "]" );
		} else {
			console.log("Failed to delete Request bid [bidId: " + req.params.bidId + "]");
		}
		res.redirect('/viewRequestJob/' + req.params.jobId);
	});
});

/* POST for delete offers */
router.post('/off/:jobId/:bidId', function(req, res, next) {
	pool.query(sql_query_delete_off_bid, [req.params.bidId], (err) => {
		if (!err) {
			console.log("Successfully deleted Offer bid [bidId: " + req.params.bidId + "]");
		} else {
			console.log("Failed to delete Offer bid [bidId: " + req.params.bidId + "]");
		}
		res.redirect('/viewOfferJob/' + req.params.jobId);
	});
});

module.exports = router;
