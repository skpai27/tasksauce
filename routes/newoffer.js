var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});
/* SQL Query */
var sql_query = 'INSERT INTO job_offer VALUES';

// GET
router.get('/', function(req, res, next) {
	if(req.isAuthenticated()){
		console.log(req.isAuthenticated);
		res.render('newoffer', { title: 'Make a Offer' });
	}
	else{
		res.redirect('../signuplogin');
	}
});

// POST
router.post('/', function(req, res, next) {
	// Retrieve Information
	var job = req.body.job;
	var loc = req.body.loc;
	var date= req.body.date;
	var time = req.body.time;
	var details = req.body.details;
	var user = req.user.username;
	
	// Construct Specific SQL Query
	var insert_query = sql_query + "('" + job + "','" + loc + "','" + date + "','" + time +  "','" + details + "','" + user +"');";
	console.log(insert_query);
	pool.query(insert_query, (err, data) => {
		if(err)throw err;
		res.redirect('/tasks');
	});
});

module.exports = router;
