const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/* SQL Queries */
var sql_query_delete_req = sql_query.query.delete_request;
var sql_query_delete_off = sql_query.query.delete_offer;

/* POST for delete requests */
router.post('/req/:jobId', function(req, res, next) {
	pool.query(sql_query_delete_req, [req.params.jobId], (err) => {
		if (!err) {
			console.log("Successfully deleted Request [jobId: " + req.params.jobId + "]");
		} else {
			console.log("Failed to delete Request [jobId: " + req.params.jobId + "]");
			throw err;
		}
		res.redirect('/requests');
	});
});

/* POST for delete offers */
router.post('/off/:jobId', function(req, res, next) {
	console.log(req.params);
	pool.query(sql_query_delete_off, [req.params.jobId], (err) => {
		if (!err) {
			console.log("Successfully deleted Offer [jobId: " + req.params.jobId + "]");
		} else {
			console.log("Failed to delete Offer [jobId: " + req.params.jobId + "]");
			throw err;
		}
		res.redirect('/offers');
	});
});

module.exports = router;
