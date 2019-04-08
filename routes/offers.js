const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

router.get('/', function(req, res, next) {
	pool.query(sql_query.query.all_available_offers, (err, offers) => {
		if (err) throw err;
		if (req.isAuthenticated()) {
			res.render('offers', { auth: true, title: 'Offers', offers: offers.rows });
		} else {
			res.render('offers', { auth: false, title: 'Tasks', offers: offers.rows });
		}
	});
});

module.exports = router;
