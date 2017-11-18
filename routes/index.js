var express = require('express');
var router = express.Router();
var http = require('http').Server(express);
var io = require('socket.io')(http);

/* GET home page. */
router.get('/', function(req, res, next) {
  const uri = req.protocol + '://' + req.get('host');
  req.app.locals.uri = uri
  res.render('index', { title: '' });
});

module.exports = router;
