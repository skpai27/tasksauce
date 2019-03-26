var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
/* --- V7: Using Dot Env ---
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '********',
  port: 5432,
})
*/
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});
/* SQL Query */
var sql_query = 'INSERT INTO job_request VALUES';

// GET
router.get('/', function(req, res, next) {
	if(req.isAuthenticated()){
		res.render('addJob', { title: 'Modifying Database' });
	}
	else {
		res.redirect('/login');
	}
});

// POST
router.post('/', function(req, res, next) {
	// Retrieve Information
	var job = req.body.job;
	var loc = req.body.loc;
	var date= req.body.date;
	var time = req.body.time;
	var desc = req.body.des;
	
	// Construct Specific SQL Query
	var insert_query = sql_query + "('" + job + "','" + loc + "','" + date + "','" + time +  "','" + desc + "');";
	console.log(insert_query);
	pool.query(insert_query, (err, data) => {
		if(err)throw err;
		res.redirect('/select');
	});
});

module.exports = router;
