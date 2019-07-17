'use strict';

const FileController      = require("./../../controllers").FileController;
const DirectoryController = require("./../../controllers").DirectoryController;
const mongoose = require('mongoose');
const fs = require('fs');

class FileControllerSocket {

    constructor() {
    }

    async create(data) {
        try {
            if (data.id === '0') {
                const g = await FileController.create(data.name, Date.now(), 1, data.extension,data.user,data.parent_directory);
                data.id = g._id;
            } else {
                const File = await FileController.getById(mongoose.Types.ObjectId(data.id));
                const g = await FileController.update(mongoose.Types.ObjectId(data.id), {name : data.name,  file_version: File.file_version + 1, file_type: data.extension}); //@TODO update file folder too
                data.id = g._id;
            }
        } catch (err) {
            console.log(err.toString());
            return;
        }
        fs.writeFile(process.env.FILES_PATH + data.id, data.content, function (err) {
            if (err) throw err;
        });
    }

    async delete(data) {
        try {
            const g = await FileController.delete(mongoose.Types.ObjectId(data.id));
            fs.unlink(process.env.FILES_PATH + data.id, function (err) {
                if(err){
                    return;
                }
            });
        } catch (e) {
            console.log(e.toString());
        }
    }
}

module.exports = new FileControllerSocket();
