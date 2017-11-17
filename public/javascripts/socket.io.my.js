"use strict"

var form = document.getElementById('my-form');
var admin_form = document.getElementById('my-admin-form');
var id_from_params = new URLSearchParams(window.location.search).get('id');
var uri = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
var socket = io(uri);
var session_id;
var admin_session_id;
var list = document.getElementsByClassName('messages')[0];

var utils = {
  clearInput: function clearInput() {
    document.getElementById('message').value = '';
  },

  getMessage: function getMessage() {
    return document.getElementById('message').value;
  },

  addToList: function addToList(source, message) {
    var message = source === 'them' ? message : utils.getMessage();
    var item = document.createElement('li');
    var txt = document.createTextNode(message);
    item.classList.add(source);
    item.appendChild(txt);
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
  utils.addToList('them', message);
});

message_form.addEventListener('submit', function(e) {
  var message_options = utils.createMessageOptions();
  socket.emit(message_type, message_options);
  utils.addToList('me');
  utils.clearInput();
  e.preventDefault();
});
