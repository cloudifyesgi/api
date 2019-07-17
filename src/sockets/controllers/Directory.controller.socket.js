'use strict';

const DirectoryController = require("./../../controllers").DirectoryController;
const mongoose = require('mongoose');

class DirectoryControllerSocket {

    constructor() {
    }

    async create(data) {
        console.log(data);
        try {
            if (data.id === '0') {
                const g = await DirectoryController.create(data.name, data.user ,data.parent_directory, Date.now()); //@TODO update user_create, user_update
            } else {
                const g = await DirectoryController.update(mongoose.Types.ObjectId(data.id), {user_update : mongoose.Types.ObjectId(data.user), name : data.name});
            }
        } catch (e) {
            console.log(e.toString());
        }
    }

    async delete(data) {
        try {
            const g = await DirectoryController.delete(mongoose.Types.ObjectId(data.id));
        } catch (e) {
            console.log(e.toString());
        }
    }
}

module.exports = new DirectoryControllerSocket();
