'use strict';

const DirectoryController = require("./../../controllers").DirectoryController;
const mongoose = require('mongoose');

class DirectoryControllerSocket {

    constructor() {
    }

    async create(data) {
        try {
            if (data.id === '0') {
                console.log('Folder ' + data.id + ' doesnt exists');
                const g = await DirectoryController.create(data.name, data.user ,data.parent_directory, Date.now()); //@TODO update user_create, user_update
            } else {
                const g = await DirectoryController.update(mongoose.Types.ObjectId(data.id), {user_update : mongoose.Types.ObjectId(data.user), name : data.name});
            }
        } catch (e) {
            console.log(e.toString());
        }
    }

    async delete(data) {
        console.log("in directory delete");
        try {
            const g = await DirectoryController.delete(mongoose.Types.ObjectId(data.id));
            console.log(data.id + ' folder deleted !');
        } catch (e) {
            console.log(e.toString());
        }
    }
}

module.exports = new DirectoryControllerSocket();
