var express = require('express');
var router = express.Router();
const sql_query = require('../sql');

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

var query_user = sql_query.query.userpass;

router.get('/:username', function(req, res) {
        pool.query(query_user, [req.params.username], (err, profile) => {
            if (req.isAuthenticated()) {
                console.log(profile.rows[0].username);
                res.render('profile', {user: profile.rows[0], auth: true});
            } else {
                res.render('profile', {user: profile.rows[0], auth: false});
            }
        })
})

module.exports = router;