'use strict';

module.exports = {
    createEvent: (name, fn) => {
        return {name, fn};
    },
    bindEvent: (socket, {name, fn}) => {
        socket.on(name, fn);
    }
};
