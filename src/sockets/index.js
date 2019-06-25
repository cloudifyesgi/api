const Io = require('socket.io');

const bindEvent = require("./../helpers/socket").bindEvent;
const messageHandlers =  require( "./File.socket");

const handlers = Object.values({
    ...messageHandlers
});

console.log(handlers);
module.exports = (listener) => {
    const io = Io.listen(listener);

    io.on("connection", (socket) => {
        handlers.forEach((handler) => {
            bindEvent(socket, handler);
        });
    });
};
