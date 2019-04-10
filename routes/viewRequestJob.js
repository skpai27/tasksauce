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

var sql_query_getrequestjob = sql_query.query.query_request_job;
var sql_query_get_bid_request = sql_query.query.query_bids_request;
var sql_query_insert_bids = sql_query.query.insert_request_bids;
var sql_query_accept_request_bids = sql_query.query.update_request_bids;
var sql_query_job_from_bidId = sql_query.query.query_request_from_bidId;


router.get('/:jobId', function(req, res, next) {

    pool.query(sql_query_getrequestjob, [req.params.jobId], (err, data) => {
      if (err) {
        throw err;
      }

      pool.query(sql_query_get_bid_request, [req.params.jobId], (err2,data2) => {

        if (err2) {
         throw err;
        }

        if (req.isAuthenticated()) {

          if(req.user.username === data.rows[0].username){
            res.render('viewRequestJob', { auth:true, self:true ,title: 'Database Connect', jobId: req.params.jobId,data: data.rows,data2:data2.rows});
          } else {
            res.render('viewRequestJob', { auth:true, self:false, title: 'Database Connect', jobId: req.params.jobId,data: data.rows,data2:data2.rows});
          }
        
        } else {
          res.render('viewRequestJob', { auth:false, self:false, title: 'Database Connect', jobId: req.params.jobId,data: data.rows,data2:data2.rows});
        }
      });

    });
    
});

router.post('/:jobId', function(req, res, next) {
  pool.query(sql_query_insert_bids, [req.params.jobId, req.user.username, req.body.price, req.body.details], (err, data) => {
    console.log(sql_query_insert_bids);
    if (err) {
        console.log(err);
    } 
    res.redirect('/viewRequestJob/' + req.params.jobId);
  })
})

router.post('/accept/:bidId', function(req, res, next) {
  pool.query(sql_query_job_from_bidId, [req.params.bidId], (err, jobId) => {
    pool.query(sql_query_accept_request_bids, [jobId.rows[0].job_id, req.params.bidId], (err, bidId) => {
      if(err){
        console.log(sql_query);
        throw err;
      } 
      res.redirect('/dashboard');
    });
  });
});

module.exports = router;
