var express = require('express');
var router = express.Router();

/*--bcrypt Stuff--*/
const bcrypt = require('bcrypt')
const round = 10;
const salt  = bcrypt.genSaltSync(round);

var app = express();

const { Pool, Client } = require('pg');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'INSERT INTO users VALUES';

//GET
//for now, if user is authed, then go into index page.
router.get('/', function(req, res, next) {
    res.render('register', { title: 'Register', userData: req.user });
});

//POST (handles register)
router.post('/', function(req, res) {
    //not using bcrypt yet, also never check passwords r same, or that 
    console.log("in post method");
	var newUsername = req.body.username;
	var newEmail = req.body.email;
	var inputPassword = req.body.password;
	var newPassword = bcrypt.hashSync(req.body.password, salt);
	var repeatPassword = req.body.confirm_password;
	var errMsg;

	if(inputPassword===repeatPassword){
		var register_query = sql_query + "('" + newUsername + "','" + newEmail + "','" + newPassword + "')";
		pool.query(register_query, (err, data) => {
			if(err){
				errMsg = "Registration failed! Please enter a different username!";
				console.log(err);
			} else {
				errMsg = "Registration successful! Please log in.";
				console.log("no error");
			}
			res.render('signuplogin', {errMsg:errMsg, title: 'Welcome to TaskSauce!'});		
		})
	} else { //should execute if passwords provided do not match.
		errMsg = "Passwords provided do not match."
		res.render('signuplogin', {errMsg:errMsg, title: 'Welcome to TaskSauce!'});		
	}
		
})

module.exports = router;