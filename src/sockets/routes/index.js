'use strict';

const fileHandlers =  require( "./File.socket");
const directoryHandlers =  require( "./Directory.socket");
const userHandlers =  require( "./User.socket");
const docifyHandlers = require('./Docify.socket');

module.exports =  Object.values({
    ...fileHandlers,
    ...directoryHandlers,
    ...userHandlers,
    ...docifyHandlers
});
