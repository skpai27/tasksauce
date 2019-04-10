var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('index', {auth: true, title: 'Express' });
  } else {
    res.render('index', {auth: false, title: 'Express' });
  }
});

module.exports = router;
