var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

router.get('/:jobId', function(req, res, next) {
    var sql_query = 'SELECT * FROM job_request ' + "WHERE job_id = " + "'"+req.params.jobId+"'";
    console.log(sql_query);
    pool.query(sql_query, (err, data) => {
      if(err)throw err;
      res.render('viewJob', { title: 'Database Connect', data: data.rows });
    });
  });
  
module.exports = router;
