'use strict';

require('dotenv').config();
const Rollbar = require("rollbar");
const rollbar = new Rollbar({
    accessToken: 'd3f9e301c7664fb98c08f8ff95663dd6',
    captureUncaught: true,
    captureUnhandledRejections: true
});
class Logger {

    constructor() {
        this.modEnv = process.env.MODE_ENV || 'development';
    }

    info(msg) {
        if(this.modEnv === 'production'){
            rollbar.info(msg);
        } else {
            console.info(msg);
        }
    }

    warn(msg) {
        if(this.modEnv === 'production') {
            rollbar.warn(msg);
        } else {
            console.warn(msg);
        }
    }

    error(msg) {
        if(this.modEnv === 'production') {
            rollbar.error(msg);
        } else {
            console.error(msg);
        }
    }
}

module.exports = new Logger();
