var express = require('express');
var router = express.Router();
var http = require('http').Server(express);
var io = require('socket.io')(http);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  console.log(req.body.message);
  res.json(req.body)
});

module.exports = router;
