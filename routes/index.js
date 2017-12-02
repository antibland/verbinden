'use strict';

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const uri = req.protocol + '://' + req.get('host');
  req.app.locals.uri = uri;
  res.render('index', {title: ''});
});

module.exports = router;
