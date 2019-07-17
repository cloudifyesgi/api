const socketIo = require('socket.io');

class SocketIo {

     constructor() {}

    static io(server) {
         if(!SocketIo.socket) {
             SocketIo.socket = socketIo(server);
         }
         return SocketIo.socket;
    }
}

module.exports = SocketIo.io;
