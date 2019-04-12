var express = require('express');
var router = express.Router();
var errorMsg = "";
const sql_query = require('../sql');

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

var query_user = sql_query.query.userpass;
var query_user_comments = sql_query.query.query_user_comments;
var add_user_comments = sql_query.query.add_user_comments
router.get('/:username', function(req, res) {
        pool.query(query_user, [req.params.username], (err, profile) => {
            pool.query(query_user_comments, [req.params.username],(err,comments) => {
                if (req.isAuthenticated()) {
                    console.log(profile.rows[0].username);
                    res.render('profile', {user: profile.rows[0],comments : comments.rows, auth: true});
                } else {
                    res.render('profile', {user: profile.rows[0],comments : comments.rows, auth: false});
                }
            });
        });
        
});

router.post('/:username',function(req,res,next) {
    pool.query(add_user_comments,[req.user.username,req.params.username,req.body.details],(err,data)=>{
        if(err) errorMsg = "Stop repeating yourself!";
        pool.query(query_user, [req.params.username], (err, profile) => {
            pool.query(query_user_comments, [req.params.username],(err,comments) => {
                if (req.isAuthenticated()) {
                    console.log(profile.rows[0].username);
                    res.render('profile', {errorMsg:errorMsg,user: profile.rows[0],comments : comments.rows, auth: true});
                } else {
                    res.render('profile', {errorMsg,errorMsg,user: profile.rows[0],comments : comments.rows, auth: false});
                }
            });
        });


    });

});
module.exports = router;