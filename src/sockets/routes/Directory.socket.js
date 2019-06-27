'use strict';

const directoryControllerSocket = require('../controllers/Directory.controller.socket');

const createEvent = require('../../helpers/socket').createEvent;
module.exports    = {
    directoryCreate: createEvent("directory:create",  directoryControllerSocket.create)
};

