'use strict';

const DocifyController = require("./../../controllers").DocifyController;
const mongoose         = require('mongoose');
const _                = require('lodash');

class DocifyControllerSocket {


    constructor() {
        DocifyControllerSocket.docifyInstance = {};
    }

    async connect(data) {
        try {
            if (data.userId && data.docifyId) {
                if (!DocifyControllerSocket.docifyInstance.hasOwnProperty(data.docifyId)) {
                    DocifyControllerSocket.docifyInstance[data.docifyId] = [];
                }

                DocifyControllerSocket.removeFromDocifyInstance(data.userId, 2);
                const docify = await DocifyController.softGetById(data.docifyId);
                DocifyControllerSocket.docifyInstance[data.docifyId].push({userId: data.userId, socket: this});
                this.join(data.docifyId);
                this.emit('docify:content', docify);

                this.on('disconnect', () => {
                    DocifyControllerSocket.removeFromDocifyInstance(this.id, 1);
                });
            } else {
                this.emit('connectError');
            }
        } catch (e) {
            console.log('docify connect error');
        }
    }

    async disconnect(data) {
        DocifyControllerSocket.removeFromDocifyInstance(data.userId, 2);
    }

    async update(data) {
        console.log(data);
        DocifyController.update(data.docify._id, {
            content: data.docify.content,
            user_update: mongoose.Types.ObjectId(data.userId)
        });
        this.broadcast.to(data.docify._id).emit('docify:content', data.docify);
    }

    static removeFromDocifyInstance(data, target) {
        _.forEach(DocifyControllerSocket.docifyInstance, (instance, key) => {
            _.remove(DocifyControllerSocket.docifyInstance[key], (user) => {
                if (target === 1) {
                    if (user.socket.id === data) {
                        user.socket.leave(key);
                        return true;
                    }
                    return false;
                } else if (target === 2) {
                    if (user.userId === data) {
                        user.socket.leave(key);
                        return true;
                    }
                    return false;
                }
                return false;
            });
        });
    }


}

module.exports = new DocifyControllerSocket();
