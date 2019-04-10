const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query_is_admin = sql_query.query.is_admin;
var sql_query_offer = sql_query.query.query_offer_job;
var sql_query_edit = sql_query.query.edit_offer;

// GET
router.get('/:jobId', function(req, res, next) {
	pool.query(sql_query_is_admin, [req.user.username], (err, isAdmin) => {
		if (!err) {
			if (req.isAuthenticated && isAdmin) {
				console.log("Admin [" + req.user.username + "] is going to edit offer");
				pool.query(sql_query_offer, [req.params.jobId], (err, offer) => {
					if (!err) {
						res.render('editoffer', { title: 'Edit Offer', offer: offer.rows });
					} else {
						console.log("Failed to retrieve offered task");
					}
				})
			} else if (req.isAuthenticated && !isAdmin) {
				// TODO: Handle non-admin attempt to access
				res.redirect('../');
			} else {
				res.redirect('../signuplogin');
			}
		} else {
			console.log("Admin & auth check failed");
		}
	})
});

// POST
router.post('/:jobId', function(req, res, next) {
	// Retrieve Information from Form
	var job = req.body.job;
	var loc = req.body.loc;
	var date= req.body.date;
	var time = req.body.time;
	var details = req.body.details;

	pool.query(sql_query_edit, [req.params.jobId, job, loc, date, time, details], (err) => {
		if (err) { 
			throw err;
		} else {
			console.log("Successfully edited Offer [jobId: " + req.params.jobId + "]");
			res.redirect('/offers');
		}
	})
});

module.exports = router;
