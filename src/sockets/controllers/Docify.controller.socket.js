'use strict';

const DocifyController = require("./../../controllers").DocifyController;
const mongoose         = require('mongoose');
const _                = require('lodash');
const DiffMatchPatch   = require('diff-match-patch');
const dmp              = require('../../helpers/dmp');

class DocifyControllerSocket {


    constructor() {
        DocifyControllerSocket.docifyInstance = {};
        DocifyControllerSocket.dpm            = new DiffMatchPatch();
    }

    async connect(data) {
        try {
            if (data.userId && data.docifyId) {
                if (!DocifyControllerSocket.docifyInstance.hasOwnProperty(data.docifyId)) {
                    DocifyControllerSocket.docifyInstance[data.docifyId]           = {};
                    DocifyControllerSocket.docifyInstance[data.docifyId].content   = '';
                    DocifyControllerSocket.docifyInstance[data.docifyId].plainText = '';
                    DocifyControllerSocket.docifyInstance[data.docifyId].users     = [];
                }

                DocifyControllerSocket.removeFromDocifyInstance(data.userId, 2);
                const docify                                                   = await DocifyController.softGetById(data.docifyId);
                DocifyControllerSocket.docifyInstance[data.docifyId].content   = docify.content;
                DocifyControllerSocket.docifyInstance[data.docifyId].plainText = docify.plainText;
                DocifyControllerSocket.docifyInstance[data.docifyId].users.push({userId: data.userId, socket: this});
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
        data = DocifyControllerSocket.makePatches(data);

        DocifyControllerSocket.docifyInstance[data.docify._id].content   = data.docify.content;
        DocifyControllerSocket.docifyInstance[data.docify._id].plainText = data.docify.plainText;
        DocifyController.update(data.docify._id, {
            content: data.docify.content,
            plainText: data.docify.plainText,
            user_update: mongoose.Types.ObjectId(data.userId)
        });
        this.broadcast.to(data.docify._id).emit('docify:content', data.docify);
    }

    static makePatches(data) {
        data.docify.plainText = !!data.docify.plainText ? data.docify.plainText : '';
        data.docify.plainText = data.docify.plainText.split('').slice(0, data.docify.plainText.length - 1).join('');
        data.docify.content   = data.docify.content === null ? '' : data.docify.content;

        const oldHtml      = DocifyControllerSocket.docifyInstance[data.docify._id].content;
        const oldPlainText = DocifyControllerSocket.docifyInstance[data.docify._id].plainText;

        const result = dmp.patch(oldHtml, data.docify.content);

        const resultPlainText = dmp.patch(oldPlainText, data.docify.plainText);

        data.docify.plainText                                            = resultPlainText[0];
        data.docify.content                                              = result[0];

        return data;
    }
    static removeFromDocifyInstance(data, target) {
        _.forEach(DocifyControllerSocket.docifyInstance, (instance, key) => {
            _.remove(DocifyControllerSocket.docifyInstance[key].users, (user) => {
                if (target === 1) {
                    if (user.socket.id === data) {
                        user.socket.leave(key, null);
                        return true;
                    }
                    return false;
                } else if (target === 2) {
                    if (user.userId === data) {
                        user.socket.leave(key, null);
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
