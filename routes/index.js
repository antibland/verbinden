var express = require('express');
var router = express.Router();
var http = require('http').Server(express);
var io = require('socket.io')(http);

/* GET home page. */
router.get('/', function(req, res, next) {
  req.app.locals.uri = req.protocol + '://' + req.get('host')
  res.render('index', { title: 'Express' });
});

module.exports = router;
