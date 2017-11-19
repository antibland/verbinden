"use strict"

var form = document.getElementById('my-form');
var admin_form = document.getElementById('my-admin-form');
var id_from_params = new URLSearchParams(window.location.search).get('id');
var uri = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
var socket = io(uri);
var session_id;
var admin_session_id;
var list = document.getElementsByClassName('messages')[0];
var typing_timeout;

var utils = {
  clearInput: function clearInput() {
    document.getElementById('message').value = '';
  },

  getMessage: function getMessage() {
    return document.getElementById('message').value;
  },

  addToList: function addToList(source, message) {
    var message = source === 'theirs' ? message : utils.getMessage();
    var item = document.createElement('li');
    var txt_wrap = document.createElement('p');
    var txt = document.createTextNode(message);
    txt_wrap.appendChild(txt);
    item.classList.add(source);
    item.classList.add('entry');
    item.appendChild(txt_wrap);
    list.appendChild(item);
  },

  createMessageOptions: function createMessageOptions() {
    return admin_form ? { message: utils.getMessage(),
                          user_id: id_from_params,
                          admin_id: session_id }
                      : {
                          message: utils.getMessage(),
                          id: session_id
                        };
  }
};

// message related data
var message_form    = admin_form ? admin_form : form;
var message_type    = admin_form ? 'admin message' : 'chat message';

socket.on('connect', function() {
  session_id = socket.id
});

socket.on('chat message', function(message) {
  utils.addToList('theirs', message);
});

socket.on('typing', function() {
  document.body.classList.add('typing');
});

socket.on('stopped typing', function() {
  document.body.classList.remove('typing');
});

document.getElementById('message').addEventListener('keydown', function() {
  clearTimeout(typing_timeout);
  var user_type = admin_form ? 'admin' : 'client';
  socket.emit('typing', { user_type: user_type, user_id: id_from_params });

  typing_timeout = setTimeout(function() {
    socket.emit('stopped typing', { user_type: user_type, user_id: id_from_params })
  }, 3000);
});

message_form.addEventListener('submit', function(e) {
  var message_options = utils.createMessageOptions();
  socket.emit(message_type, message_options);
  utils.addToList('mine');
  utils.clearInput();
  e.preventDefault();
});
