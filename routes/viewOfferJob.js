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
var sql_query_admin = sql_query.query.is_admin;
var sql_query_edit_bid_offer = sql_query.query.edit_offer_bid;
var sql_query_one_off_bid = sql_query.query.query_offer_from_bidId;

/*** To get the viewOfferJob page for non-editing purposes ***/
router.get('/:jobId', function(req, res, next) {
    pool.query(sql_query_getofferjob, [req.params.jobId], (err, data) => {
      if (err) {
        throw err;
      }

      pool.query(sql_query_get_bid_offer, [req.params.jobId], (err2,data2) => {
        if (err2) {
         throw err;
        }

        if (req.isAuthenticated()) {
          pool.query(sql_query_admin, [req.user.username], (err, isAdmin) => {
            if (req.user.username === data.rows[0].username) {
              if (isAdmin.rows[0].is_admin) {
              res.render('viewOfferJob', { auth:true, admin: true, self:true, edit: false, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows});
              } else {
                res.render('viewOfferJob', { auth:true, admin: false, self:true, edit: false, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows});
              }
            } else {
              if (isAdmin.rows[0].is_admin) {
                res.render('viewOfferJob', { auth:true, admin: true, self:false, edit: false, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows});
              } else {
                res.render('viewOfferJob', { auth:true, admin: false, self:false, edit: false, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows});
              }
            }
          });
        } else {
          res.render('viewOfferJob', { auth:false, self:false, admin:false, edit: false, title: 'Database Connect', currentUser: null, jobId: req.params.jobId, data: data.rows, data2:data2.rows});
        }
      });
    
    });
});

/*** To get the viewOfferJob page for editing purposes ***/
router.get('/:jobId/edit/:bidId', function(req, res, next) {
    pool.query(sql_query_getofferjob, [req.params.jobId], (err, data) => {
      if (err) {
        throw err;
      }

      pool.query(sql_query_get_bid_offer, [req.params.jobId], (err2,data2) => {
        if (err2) {
         throw err;
        }

        if (req.isAuthenticated()) {
          pool.query(sql_query_admin, [req.user.username], (err, isAdmin) => {
            if (err) {
              throw err;
            } else {
              pool.query(sql_query_one_off_bid, [req.params.bidId], (err, bid) => {
                if (err) {
                  throw err;
                } else {
                  if (req.user.username === data.rows[0].username) {
                    if (isAdmin.rows[0].is_admin) {
                      res.render('viewOfferJob', { auth:true, admin: true, self:true, edit: true, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows, bidId: req.params.bidId, bid: bid.rows});
                    } else {
                      res.render('viewOfferJob', { auth:true, admin: false, self:true, edit: true, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows, bidId: req.params.bidId, bid: bid.rows});
                    }
                  } else {
                    if (isAdmin.rows[0].is_admin) {
                      res.render('viewOfferJob', { auth:true, admin: true, self:false, edit: true, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows, bidId: req.params.bidId, bid: bid.rows});
                    } else {
                      res.render('viewOfferJob', { auth:true, admin: false, self:false, edit: true, title: 'Database Connect', currentUser: req.user.username, jobId: req.params.jobId, data: data.rows,data2:data2.rows, bidId: req.params.bidId, bid: bid.rows});
                    }
                  }
                }
              }) 
            }
          });
        } else {
          res.render('viewOfferJob', { auth:false, self:false, admin:false, edit: false, title: 'Database Connect', currentUser: null, jobId: req.params.jobId, data: data.rows, data2:data2.rows, bidId: req.params.bidId});
        }
      });
    
    });
});



// router.get('/:jobId', function(req, res, next) {

//   pool.query(sql_query_getofferjob, [req.params.jobId], (err, data) => {
//     if (err) {
//       throw err;
//     }


//     pool.query(sql_query_get_bid_offer, [req.params.jobId], (err2,data2) => {

//       if (err2) {
//         throw err2;
//       }

//       if (req.isAuthenticated()) {

//         if (req.user.username.trim() === data.rows[0].username.trim()) {
//           res.render('viewOfferJob', { auth:true, self:true ,title: 'Database Connect', jobId: req.params.jobId, data: data.rows, data2:data2.rows});
//         } else {
//           res.render('viewOfferJob', { auth:true, self:false, title: 'Database Connect', jobId: req.params.jobId, data: data.rows, data2:data2.rows});
//         }
    
//       } else {
//         res.render('viewOfferJob', { auth:false, self:false, title: 'Database Connect', jobId: req.params.jobId,data: data.rows,data2:data2.rows});
//       }
//     });

//   });
  
// });

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

router.post('/:jobId/edit/:bidId', function(req, res, next) {
  // Retrieve Information from Form
  var price = req.body.price;
  var info = req.body.details;

  pool.query(sql_query_edit_bid_offer, [req.params.jobId, req.params.bidId, price, info], (err) => {
    if (err) { 
      throw err;
    } else {
      console.log("Successfully edited bid [bidId: " + req.params.bidId + "] for Offer [jobId: " + req.params.jobId + "]");
      res.redirect('/viewOfferJob/' + req.params.jobId);
    }
  });
});

module.exports = router;
