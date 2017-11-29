"use strict"

var form = document.getElementById('my-form');
var admin_form = document.getElementById('my-admin-form');
var id_from_params;
var uri = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
var socket = io(uri);
var session_id;
var admin_session_id;
var list = document.getElementsByClassName('messages')[0];
var typing_timeout;

if ("URLSearchParams" in window) {
  id_from_params = new URLSearchParams(window.location.search).get('id');
} else {
  window.URLSearchParams = function(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  id_from_params = window.URLSearchParams('id');
}

var utils = {
  blurInput: function blurInput() {
    document.getElementById('message').blur();
  },

  clearInput: function clearInput() {
    document.getElementById('message').value = '';
  },

  getMessage: function getMessage() {
    return document.getElementById('message').value;
  },

  addToList: function addToList(source, message) {
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
    var message = utils.getMessage();
    return admin_form ? { message: message,
                          user_id: id_from_params,
                          admin_id: session_id }
                      : {
                          message: message,
                          id: session_id
                        };
  }
};

// message related data
var message_form = admin_form ? admin_form : form;
var message_type = admin_form ? 'admin message' : 'chat message';

socket.on('connect', function() {
  session_id = socket.id
});

socket.on('disconnect', function() {
  document.body.classList.remove('typing');
  document.body.classList.add('disconnect');
  utils.addToList('system', 'Chat disconnected');
  utils.blurInput();
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

socket.on('play notification', function() {
  document.getElementById('click_sound').play();
});

document.getElementById('message').addEventListener('keydown', function(e) {
  clearTimeout(typing_timeout);
  var user_type = admin_form ? 'admin' : 'client';
  var data = { user_type: user_type };

  if (user_type === 'admin') {
    data['user_id'] = id_from_params;
    data['admin_id'] = session_id;
  } else if (user_type === 'client') {
    data['user_id'] = session_id;
  }

  socket.emit('typing', data);

  typing_timeout = setTimeout(function() {
    socket.emit('stopped typing', data);
  }, 2000);
});

message_form.addEventListener('submit', function(e) {
  var message_options = utils.createMessageOptions();
  socket.emit(message_type, message_options);
  utils.addToList('mine', utils.getMessage());
  utils.clearInput();
  e.preventDefault();
});

document.addEventListener('DOMContentLoaded', function() {
  document
  .getElementById('chat-bubble')
  .addEventListener('click', function() {
    this.classList.toggle('active');

    if (this.classList.contains('active') && !document.body.classList.contains('disconnect')) {
      document.getElementById('message').focus();
    }
  });

  if (admin_form) {
    document.getElementById('chat-bubble').classList.add('active');
    document.getElementById('message').focus();
  }
})
