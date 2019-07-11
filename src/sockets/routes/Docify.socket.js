'use strict';

const docifyControllerSocket = require('../controllers/Docify.controller.socket');

const createEvent = require('../../helpers/socket').createEvent;
module.exports    = {
    docifyConnect: createEvent("docify:connect", docifyControllerSocket.connect),
    docifyDisconnect: createEvent('docify:disconnect', docifyControllerSocket.disconnect),
    DocifyUpdate: createEvent('docify:update', docifyControllerSocket.update)
};

