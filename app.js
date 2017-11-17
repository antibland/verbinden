var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

if (app.get('env') === 'development') {
  require('dotenv').config()
} else {

}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.get('/chat', function(req, res) {
  const id = req.query.id;
  res.render('chat', { title: 'Site chat', id });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.locals.uri = '';
app.locals.current_clients = [];
app.locals.admin_id = '';

io.on('connection', function(socket) {
  io.clients((error, clients) => {
    if (error) throw error;
    console.log('total connected', clients.length, '\ncurrent clients', clients);
  });

  socket.on('admin message', data => {
    app.locals.admin_id = data.admin_id;
    io.to(data.user_id).emit('chat message', data.message);
  });

  socket.on('chat message', data => {
    if (!app.locals.current_clients.includes(data.id)) {
      app.locals.current_clients.push(data.id);

      var send = require('gmail-send')({
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
          to:   process.env.EMAIL_USER,
          subject: 'Chat started from website!',
          html:    `<h2>${data.message}<h2>
                    <br><br>
                    <a href="${app.locals.uri}/chat?id=${data.id}">Join the chat</a>`
        });

      send({}, function (err, res) {
        if (err) throw error;
        io.emit('chat message', 'Thanks for reaching out. I\'ll be right with you.');
      });
    } else {
      io.to(app.locals.admin_id).emit('chat message', data.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('user ' + socket.id + ' disconnected');
  });
});

module.exports = {app: app, server: server};
