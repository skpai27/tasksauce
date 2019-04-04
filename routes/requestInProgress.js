var express = require('express');
var router = express.Router();
const sql_query = require('../sql');

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

var query_get_bid = sql_query.query.query_bid_from_request;
var query_get_job = sql_query.query.query_request_job;

router.get('/:jobId', function(req, res, next) {
  if (req.isAuthenticated()) {
    pool.query(query_get_bid, [req.params.jobId], (err, bidId) => {
      pool.query(query_get_job, [req.params.jobId], (err, job) => {
        res.render('requestInProgress', {bid: bidId.rows[0], data: job.rows});
      });
    });
  } else {
    res.redirect('/signuplogin', { title: 'login'});
  }

})

module.exports = router;
