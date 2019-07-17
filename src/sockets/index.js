'use strict';

// const Io = require('socket.io');

const bindEvent = require("./../helpers/socket").bindEvent;
const Io = require('./../config/socket.io');
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
    run(server) {
        const io = Io(server);
        console.log("socket.io listening");
        io.on("connection", (socket) => {
            this.clientConnected.push(socket);
            handlers.forEach((handler) => {
                bindEvent(socket, handler);
            });
        });
    };
}

module.exports = CloudifySocket;
