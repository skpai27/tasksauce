var express = require('express');
var router = express.Router();
const sql_query = require('../sql');

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

var sql_query_getofferjob = sql_query.query.query_offer_job;
var sql_query_get_bid_offer = sql_query.query.query_bids_offer;
var sql_query_insert_bids = sql_query.query.insert_offer_bids;
var sql_query_accept_offer_bids = sql_query.query.update_offer_bids;
var sql_query_job_from_bidId = sql_query.query.query_offer_from_bidId;

router.get('/:jobId', function(req, res, next) {

  pool.query(sql_query_getofferjob, [req.params.jobId], (err, data) => {
    if (err) {
      throw err;
    }


    pool.query(sql_query_get_bid_offer, [req.params.jobId], (err2,data2) => {

      if (err2) {
        throw err2;
      }

      if (req.isAuthenticated()) {

        if (req.user.username.trim() === data.rows[0].username.trim()) {
          res.render('viewOfferJob', { auth:true, self:true ,title: 'Database Connect', jobId: req.params.jobId, data: data.rows, data2:data2.rows});
        } else {
          res.render('viewOfferJob', { auth:true, self:false, title: 'Database Connect', jobId: req.params.jobId, data: data.rows, data2:data2.rows});
        }
    
      } else {
        res.render('viewOfferJob', { auth:false, self:false, title: 'Database Connect', jobId: req.params.jobId,data: data.rows,data2:data2.rows});
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
    res.redirect('/viewOfferJob/' + req.params.jobId);
  })
})

router.post('/accept/:bidId', function(req, res, next) {
  pool.query(sql_query_job_from_bidId, [req.params.bidId], (err, jobId) => {
    console.log(jobId.rows);
    pool.query(sql_query_accept_offer_bids, [jobId.rows[0].job_id, req.params.bidId], (err, bidId) => {
      if(err){
        console.log(sql_query);
        throw err;
      } 
      res.redirect('/dashboard');
    });
  });
});

module.exports = router;
