'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const Right = models.Right;
const Directory = models.Directory;
const File = models.File;
const DirectoryController = require('../DirectoryController/Directory.controller');

class RightController extends Controller{

    constructor() {
        super(Right);
    }

    async create(right,directory,file,user) {
        const exists = await Right.findOne({directory:directory, file:file, user:user});
        if (exists !== null) {
            return null;
        }
        let newRight = new Right({
            right:right,directory:directory,file:file,user:user
        });
        return await newRight.save();
    }

    async update(id, fields) {
        let Right = await this.getById(id);
        return await super.update(Right, fields);
    }

    async delete(id) {
        let Right = await this.getById(id);
        return await super.delete(Right);
    }

    async getFoldersByUser(user_id) {
        let SharedRights = await Right.find( {user: user_id} );
        let SharedFolders = [];
        const start = async () => {
            await this.asyncForEach(SharedRights, async (
                element) => {
                let toPush = await Directory.findOne({ _id: element.directory, deleted: false});
                const isDeleted = await DirectoryController.isDeleted(element.directory);
                if(toPush && !isDeleted)
                    await SharedFolders.push(toPush);
            });
        };

        await start();
        return SharedFolders;
    }

    async getFilesByUser(user_id) {
        let SharedRights = await Right.find( {user: user_id} );
        let SharedFiles = [];
        const start = async () => {
            await this.asyncForEach(SharedRights, async (
                element) => {
                let toPush = await File.findOne({ _id: element.file, deleted: false});
                if(toPush)
                    await SharedFiles.push(toPush);
            });
        };

        await start();
        return SharedFiles;
    }

    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    async getRightsByDir(id) {
        return await Right.find({directory: id});
    }

    async getRightsByFile(id) {
        return await Right.find({file: id});
    }

    async getRightByDirAndUser(sharedDir, userId) {
        return await Right.findOne({directory: sharedDir, user: userId});
    }

    async getRightByFileAndUser(sharedFile, userId) {
        return await Right.findOne({file: sharedFile, user: userId});
    }
}

module.exports = new RightController();
