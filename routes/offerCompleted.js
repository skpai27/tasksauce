var express = require('express');
var router = express.Router();
const sql_query = require('../sql');

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

var query_get_bid_id = sql_query.query.query_bid_from_offer_C;
var query_get_bid = sql_query.query.query_offer_from_bidId;
var query_get_job = sql_query.query.query_offer_job;
var update_review_author_offer = sql_query.query.update_review_author_offer;
var update_review_bidder_offer = sql_query.query.update_review_bidder_offer;
var author = 0;
router.get('/:jobId', function(req, res, next) {
  if (req.isAuthenticated()) {
    pool.query(query_get_bid_id, [req.params.jobId], (err, bidID) => {
      pool.query(query_get_bid, [bidID.rows[0].bid_id], (err, bid) => {
        pool.query(query_get_job, [req.params.jobId], (err, job) => {
          if(job.rows[0].username.trim() == req.user.username.trim() || bid.rows[0].bid_user.trim() ==req.user.username.trim())
          {
            author = 1;
          } 
          res.render('viewCompletedJobOffer', {auth: true, author:author, bidID:bidID,bid: bid.rows[0], data: job.rows});
        });
      });
    });
  } else {
    res.redirect('/signuplogin');
  }
});
router.post('/:jobId', function(req, res, next) {
  if (req.isAuthenticated()) {
    pool.query(query_get_bid_id, [req.params.jobId], (err, bidID) => {
      pool.query(query_get_bid, [bidID.rows[0].bid_id], (err, bid) => {
        pool.query(query_get_job, [req.params.jobId], (err, job) => {
          if(job.rows[0].username.trim() == req.user.username.trim()){
            console.log([req.body.desc,req.body.rating_count,req.params.jobId]);
            pool.query(update_review_author_offer,[req.body.desc,req.body.rating_count,req.params.jobId],(err,data)=>{
              if (err) throw err;
              console.log(data);
              res.redirect('/offerCompleted/'+req.params.jobId);
            });
          }else if (bid.rows[0].bid_user.trim() == req.user.username.trim()){
            console.log([req.body.desc,req.body.rating_count,req.params.jobId]);
            pool.query(update_review_bidder_offer,[req.body.desc,req.body.rating_count,req.params.jobId],(err,data)=>{
              if (err) throw err;
              console.log(data);
              res.redirect('/offerCompleted/'+req.params.jobId);
            });
          }

      
        });
      });
    });
  } else {
    res.redirect('/signuplogin', {auth: false, title: 'login'});
  }

});

module.exports = router;
