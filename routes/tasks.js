const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query_request = sql_query.query.all_available_requests;
var sql_query_offer = sql_query.query.all_available_offers;
var sql_query_admin = sql_query.query.is_admin;
var is_premium_user = sql_query.query.is_premium_users;

router.get('/', function(req, res, next) {
	pool.query(sql_query_request, (err, requests) => {
    if (err) {console.log(sql_query_request);
      console.log(err);}
		pool.query(sql_query_offer, (err, offers) => {
			if (req.isAuthenticated()) {
				pool.query(sql_query_admin, [req.user.username], (err, isAdmin) => {
          pool.query(is_premium_user, [req.user.username], (err, premium) => {
            if (!err) {
              if (isAdmin.rows[0].is_admin) {
                console.log("Admin [" + req.user.username + "] accessing all tasks");
                if (premium.rows.length !== 0) {
                  res.render('tasks', { auth: true, admin: true, premium: true, title: 'Tasks', requests: requests.rows, offers: offers.rows, req:req });
                } else {
                  res.render('tasks', { auth: true, admin: true, premium: false, title: 'Tasks', requests: requests.rows, offers: offers.rows, req:req });
                }
              } else {
                if (premium.rows.length !== 0) {
                  res.render('tasks', { auth: true, admin: false, premium: true, title: 'Tasks', requests: requests.rows, offers: offers.rows, req:req });
                } else {
                  res.render('tasks', { auth: true, admin: false, premium: false, title: 'Tasks', requests: requests.rows, offers: offers.rows, req:req });
                }
              }
            } else {
              console.log("Admin check failed");
            }
          })
				})
			} else {
				res.render('tasks', { auth: false, premium: false, admin: false, title: 'Tasks', requests: requests.rows, offers: offers.rows, req:req });
			}
		})
	});
});

module.exports = router;
