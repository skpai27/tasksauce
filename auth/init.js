const sql_query = require('../sql');

const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const authMiddleware = require('./middleware');
const antiMiddleware = require('./antimiddle');

// Postgre SQL Connection
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
  //ssl: true
});

function findUser (username, callback) {
	pool.query(sql_query.query.userpass, [username], (err, data) => {
		if(err) {
			console.error("Cannot find user");
			return callback(null);
		}
		
		if(data.rows.length == 0) {
			console.error("User does not exists?");
			return callback(null)
		} else if(data.rows.length == 1) {
			return callback(null, {
				username    : data.rows[0].username,
				password    : data.rows[0].password,
				email       : data.rows[0].email
			});
		} else {
			console.error("More than one user?");
			return callback(null);
		}
	});
}

passport.serializeUser(function (user, cb) {
  console.log("in serializeUser()");
  cb(null, user.username);
})

passport.deserializeUser(function (username, cb) {
  console.log("in deserializeUser()");
  findUser(username, cb);
})

function initPassport () {
  passport.use(new LocalStrategy(
    (username, password, done) => {
      findUser(username, (err, user) => {
        if (err) {
          console.log("error1");
          return done(err);
        }

        // User not found
        if (!user) {
          console.error('User not found');
          return done(null, false);
        }
        if(err){
          console.error("user found, but password error");
          return done(err);
        }
        if(password.trim() != user.password.trim()){
          console.log(password.valueOf());
          console.log(password == user.password);
          console.log(user.password.valueOf());
          console.log("wrong password");
          return done(null, false);
        }
        console.log("authentication successful");
        return done(null, user);

        // Always use hashed passwords and fixed time comparison
        /*bcrypt.compare(password, user.passwordHash, (err, isValid) => {
          if (err) {
            return done(err);
          }
          if (!isValid) {
            return done(null, false);
          }
          return done(null, user);
        })*/
      })
    }
  ));

  passport.authMiddleware = authMiddleware;
  passport.antiMiddleware = antiMiddleware;
	passport.findUser = findUser;
}

module.exports = initPassport;
