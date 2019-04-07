const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

// router.get('/', function(req, res, next) {
// 	pool.query(sql_query.query.all_requests, (err, requests) => {
// 		console.log("Executing " + sql_query.query.all_requests);
// 		pool.query(sql_query.query.all_offers, (err, offers) => {
// 			console.log("Executing " + sql_query.query.all_offers);

/* SQL Query */
var sql_query_request = 'SELECT * FROM job_request as j where not exists (select 1 from request_bids as b where j.job_id = b.job_id and bid_accepted=true);';
var sql_query_offer = 'SELECT * FROM job_offer;';

router.get('/', function(req, res, next) {
	pool.query(sql_query_request, (err, requests) => {
		if (err) throw err;
		pool.query(sql_query_offer, (err, offers) => {
			res.render('tasks', { title: 'Tasks', requests: requests.rows, offers: offers.rows });
		})
	});
});

module.exports = router;
