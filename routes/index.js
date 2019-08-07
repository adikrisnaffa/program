var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/test', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'Express' });
});

router.get('/analytics', function (req, res, next) {
  res.render('analytics', {
    title: 'Express'
  });
});
module.exports = router;
