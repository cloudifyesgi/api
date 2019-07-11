const socketIo = require('socket.io');

class SocketIo {

     constructor() {}

    static io(server) {
         if(!SocketIo.socket) {
             console.log('new socket !');
             SocketIo.socket = socketIo(server);
         } else {
             console.log("get socket");
         }
         return SocketIo.socket;
    }
}

module.exports = SocketIo.io;
