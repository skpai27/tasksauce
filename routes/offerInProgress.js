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

var query_get_bid_id = sql_query.query.query_bid_from_offer_IP;
var query_get_bid = sql_query.query.query_offer_from_bidId;
var query_get_job = sql_query.query.query_offer_job;
var delete_offer_IP = sql_query.query.delete_offer_IP;
var query_insert_completed = sql_query.query.insert_completed_offer;

router.get('/:jobId', function(req, res, next) {
  if (req.isAuthenticated()) {
    pool.query(query_get_bid_id, [req.params.jobId], (err, bidID) => {
      pool.query(query_get_bid, [bidID.rows[0].bid_id], (err, bid) => {
        pool.query(query_get_job, [req.params.jobId], (err, job) => {
          res.render('offerInProgress', {auth: true, bid: bid.rows[0], data: job.rows});
        });
      });
    });
  } else {
    res.redirect('/signuplogin', {auth: false, title: 'login'});
  }
})

router.post('/:jobId', (req, res, next) => {
  pool.query(query_get_bid_id, [req.params.jobId], (err, bidID) => {
    pool.query(delete_offer_IP, [req.params.jobId], (err2, del) => {
      pool.query(query_insert_completed, [req.params.jobId, bidID.rows[0].bid_id], (err3, insert) => {
        res.redirect('/dashboard');
      })
    })
  })
})

module.exports = router;
