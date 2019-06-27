'use strict';

const Io = require('socket.io');

const bindEvent = require("./../helpers/socket").bindEvent;
const handlers  = require('./routes');

class CloudifySocket {

    constructor() {
        this.clientConnected = [];
    }

    static get() {
        if(!CloudifySocket.socket) {
            CloudifySocket.socket = new CloudifySocket();
        }
        return CloudifySocket.socket;
    }
    run(listener) {
        const io = Io(listener);
        console.log("socket.io listening on " + listener);
        io.on("connection", (socket) => {
            console.log('connected user');
            this.clientConnected.push(socket);
            handlers.forEach((handler) => {
                bindEvent(socket, handler);
            });
        });
    };
}

module.exports = CloudifySocket;
