var express = require('express');
var router = express.Router();
const sql_query = require('../sql');

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

var sql_query_getrequestjob = sql_query.query.query_request_job;
var sql_query_get_bid_request = sql_query.query.query_bids_request;
var sql_query_insert_bids = sql_query.query.insert_request_bids;
var sql_query_accept_request_bids = sql_query.query.update_request_bids;
var sql_query_job_from_bidId = sql_query.query.query_request_from_bidId;
var sql_query_admin = sql_query.query.is_admin;
var sql_query_edit_bid_request = sql_query.query.edit_request_bid;
var sql_query_one_req_bid = sql_query.query.query_request_from_bidId;

/*** To get the viewRequestJob page for non-editing purposes ***/
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
          pool.query(sql_query_admin, [req.user.username], (err, isAdmin) => {
            if (req.user.username === data.rows[0].username) {
              if (isAdmin.rows[0].is_admin) {
              res.render('viewRequestJob', { auth:true, admin: true, self:true, edit: false, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows});
              } else {
                res.render('viewRequestJob', { auth:true, admin: false, self:true, edit: false, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows});
              }
            } else {
              if (isAdmin.rows[0].is_admin) {
                res.render('viewRequestJob', { auth:true, admin: true, self:false, edit: false, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows});
              } else {
                res.render('viewRequestJob', { auth:true, admin: false, self:false, edit: false, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows});
              }
            }
          });
        } else {
          res.render('viewRequestJob', { auth:false, self:false, admin:false, edit: false, title: 'Database Connect', currentUser: null, jobId: req.params.jobId, data: data.rows, data2:data2.rows});
        }
      });
    
    });
});

/*** To get the viewRequestJob page for editing purposes ***/
router.get('/:jobId/edit/:bidId', function(req, res, next) {
    pool.query(sql_query_getrequestjob, [req.params.jobId], (err, data) => {
      if (err) {
        throw err;
      }

      pool.query(sql_query_get_bid_request, [req.params.jobId], (err2,data2) => {
        if (err2) {
         throw err;
        }

        if (req.isAuthenticated()) {
          pool.query(sql_query_admin, [req.user.username], (err, isAdmin) => {
            if (err) {
              throw err;
            } else {
              pool.query(sql_query_one_req_bid, [req.params.bidId], (err, bid) => {
                if (err) {
                  throw err;
                } else {
                  if (req.user.username === data.rows[0].username) {
                    if (isAdmin.rows[0].is_admin) {
                      res.render('viewRequestJob', { auth:true, admin: true, self:true, edit: true, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows, bidId: req.params.bidId, bid: bid.rows});
                    } else {
                      res.render('viewRequestJob', { auth:true, admin: false, self:true, edit: true, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows, bidId: req.params.bidId, bid: bid.rows});
                    }
                  } else {
                    if (isAdmin.rows[0].is_admin) {
                      res.render('viewRequestJob', { auth:true, admin: true, self:false, edit: true, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows, bidId: req.params.bidId, bid: bid.rows});
                    } else {
                      res.render('viewRequestJob', { auth:true, admin: false, self:false, edit: true, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows, bidId: req.params.bidId, bid: bid.rows});
                    }
                  }
                }
              }) 
            }
          });
        } else {
          res.render('viewRequestJob', { auth:false, self:false, admin:false, edit: false, title: 'Database Connect', currentUser: null, jobId: req.params.jobId, data: data.rows, data2:data2.rows, bidId: req.params.bidId});
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
});

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

router.post('/:jobId/edit/:bidId', function(req, res, next) {
  // Retrieve Information from Form
  var price = req.body.price;
  var info = req.body.details;

  pool.query(sql_query_edit_bid_request, [req.params.jobId, req.params.bidId, price, info], (err) => {
    if (err) { 
      throw err;
    } else {
      console.log("Successfully edited bid [bidId: " + req.params.bidId + "] for Request [jobId: " + req.params.jobId + "]");
      res.redirect('/viewRequestJob/' + req.params.jobId);
    }
  });
});

module.exports = router;
