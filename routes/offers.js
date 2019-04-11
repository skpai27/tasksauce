const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/* SQL Queries */
var sql_query_offers = sql_query.query.all_available_offers;
var sql_query_admin = sql_query.query.is_admin;
var sql_query_filter =sql_query.query.offers_filter;

router.get('/', function(req, res, next) {
	if("detail" in req.query){
		pool.query(sql_query_filter,[req.query.detail], (err, offers) => {
			if (err) throw err;
			if (req.isAuthenticated()) {
				pool.query(sql_query_admin, [req.user.username], (err, isAdmin) => {
					if (!err) {
						if (isAdmin.rows[0].is_admin) {
							console.log("Admin [" + req.user.username + "] accessing offers");
							res.render('offers', { auth: true, admin: true, title: 'Offers', offers: offers.rows });
						} else {
							res.render('offers', { auth: true, admin: false, title: 'Offers', offers: offers.rows });
						}
					} else {
						console.log("Admin check failed");
					}
				})
			} else {
				res.render('offers', { auth: false, admin: false, title: 'offers', offers: offers.rows });
			}
		});
	}
	else{
	pool.query(sql_query_offers, (err, offers) => {
		if (err) throw err;
		if (req.isAuthenticated()) {
			pool.query(sql_query_admin, [req.user.username], (err, isAdmin) => {
				if (!err) {
					if (isAdmin.rows[0].is_admin) {
						console.log("Admin [" + req.user.username + "] accessing offers");
						res.render('offers', { auth: true, admin: true, title: 'Offers', offers: offers.rows });
					} else {
						res.render('offers', { auth: true, admin: false, title: 'Offers', offers: offers.rows });
					}
				} else {
					console.log("Admin check failed");
				}
			})
		} else {
			res.render('offers', { auth: false, admin: false, title: 'offers', offers: offers.rows });
		}
	});}
});

module.exports = router;
