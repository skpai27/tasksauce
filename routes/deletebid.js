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
	pool.query(sql_query_delete_req_bid, [req.params.jobId, req.params.bidId], (err) => {
		if (!err) {
			console.log("Successfully deleted bid for Request [jobId: " + req.params.jobId + ", bidId: " + req.params.bidId + "]" );
		} else {
			console.log("Failed to delete bid for Request [jobId: " + req.params.jobId + ", bidId: " + req.params.bidId + "]");
		}
		res.redirect('/viewRequestJob/:jobId');
	});
});

/* POST for delete offers */
router.post('/off/:jobId/:bidId', function(req, res, next) {
	pool.query(sql_query_delete_off_bid, [req.params.jobId, req.params.bidId], (err) => {
		if (!err) {
			console.log("Successfully deleted bid for Offer [jobId: " + req.params.jobId + ", bidId: " + req.params.bidId + "]");
		} else {
			console.log("Failed to delete bid for Offer [jobId: " + req.params.jobId + ", bidId: " + req.params.bidId + "]");
		}
		res.redirect('/viewOfferJob/:jobId');
	});
});

module.exports = router;
