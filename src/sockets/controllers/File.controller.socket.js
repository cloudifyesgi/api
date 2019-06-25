'use strict';

const FileController      = require("./../../controllers").FileController;
const DirectoryController = require("./../../controllers").DirectoryController;

class FileControllerSocket {

    constructor() {
    }

    async create(data) {
        const File = await FileController.getById(ObjectId(data.id));
        console.log('File : ' + File);
        try {
            if (!File) {
                console.log('File ' + data.id + ' doesnt exists');
                const g = await FileController.create(data.name, Date.now(), 1, data.extension);
            } else {
                const g = await FileController.update(ObjectId(data.id), data.name, File.file_version + 1, data.extension); //@TODO update file folder too
            }
        } catch (err) {
            console.log(err.toString());
            return;
        }
        fs.writeFile(process.env.FILES_PATH + data.id, data.content, function (err) {
            if (err) throw err;
            console.log(data.id + ' file created !');
        });
    }

    async delete(data) {
        try {
            if (data.isFile) {
                console.log('ObjectId(data.id) : ' + ObjectId(data.id));
                const g = await FileController.delete(ObjectId(data.id));
                fs.unlink(process.env.FILES_PATH + data.id, function (err) {
                    if (err) throw err;
                });
                console.log(data.id + ' file deleted !');
            } else {
                const g = await DirectoryController.delete(ObjectId(data.id));
                console.log(data.id + ' folder deleted !');
            }
        } catch (e) {
            console.log(e.toString());
        }
    }
}

module.exports = new FileControllerSocket();
