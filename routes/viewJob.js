var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

router.get('/:jobId', function(req, res, next) {
    var sql_query = 'SELECT * FROM job_request ' + "WHERE job_id = " + "'"+req.params.jobId+"';";
    console.log(sql_query);
    pool.query(sql_query, (err, data) => {
      if(err) throw err;
      console.log("hello");
      
      pool.query("SELECT * from request_bids WHERE job_id =" + "'" + req.params.jobId + "';",(err2,data2)=>{
        if(err2)throw err2;
        console.log(data2);
        if(req.isAuthenticated()){
          if (req.user.username == data.rows[0].user) res.render('viewJob', { auth:true, self:true ,title: 'Database Connect', jobId: req.params.jobId,data: data.rows,data2:data2.rows});
          else res.render('viewJob', { auth:true, self: false ,title: 'Database Connect', jobId: req.params.jobId,data: data.rows,data2:data2.rows});
        }
        else res.render('viewJob', { auth:false, self: false, title: 'Database Connect', jobId: req.params.jobId,data: data.rows,data2:data2.rows});
        
      });

    });
  });
router.post('/:jobId', function(req,res,next){
  var sql = "INSERT INTO request_bids VALUES('" + req.params.jobId + "','" + req.user.username + "','"  + req.body.price + "','" +req.body.desc +"');";
  pool.query(sql,(err,data)=>{
    console.log(sql);
    if(err){
        console.log(this.sql);
        console.log(err);
    } 
    res.redirect('/viewJob/'+req.params.jobId);
  })
})

router.post('/accept/:bidId', function(req,res,next){
  var x =+req.params.bidId;
   var sql_query = "UPDATE request_bids as b SET bid_accepted=true where bid_id = $1 and exists (select 1 from job_request as j where j.job_id = b.job_id and j.user = $2);";
   pool.query(sql_query,[x,req.user.username],(err,data)=>{
      if(err){
        console.log(sql_query);
        throw err;
    } 
      res.redirect('/tasks');
   });


});
module.exports = router;
