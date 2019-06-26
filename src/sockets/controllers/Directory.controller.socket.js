'use strict';

const DirectoryController = require("./../../controllers").DirectoryController;

class DirectoryControllerSocket {

    constructor() {
    }

    create(data) {
        const Folder = DirectoryController.getById(ObjectId(data.id));
        try {
            if (!Folder) {
                console.log('Folder ' + data.id + ' doesnt exists');
                const g = DirectoryController.create(data.name, data.path, Date.now()); //@TODO update user_create, user_update
            } else {
                const g = DirectoryController.update(ObjectId(data.id), data.name, data.path);
            }
        } catch (e) {
            console.log(e.toString());
        }
    }
}

module.exports = new DirectoryControllerSocket();
