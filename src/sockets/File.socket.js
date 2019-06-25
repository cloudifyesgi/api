'use strict';

const fileControllerSocket = require('./controllers/File.controller.socket');

const createEvent = require('./../helpers/socket').createEvent;
module.exports    = {
    fileCreate: createEvent("file:create",  fileControllerSocket.create),
    fileDelete: createEvent('file:delete', fileControllerSocket.delete)
};

