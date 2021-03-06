'use strict';

const models          = require('../../models');
const Controller      = require('../Controller');
const Directory       = models.Directory;
const fileController  = require('../FileController/File.controller');
const mongoose        = require('mongoose');
const File            = models.File;
const uuid            = require('uuid/v1');
const mkdirp          = require('mkdirp');
const fs              = require('fs');
const AdmZip          = require('adm-zip');
const rimraf          = require("rimraf");
const Synchronization = models.Synchronization;

class DirectoryController extends Controller {

    constructor() {
        super(Directory);
    }

    async create(name, user_create, parent_directory, date) {
        parent_directory = parent_directory === '0' ? null : mongoose.Types.ObjectId(parent_directory);
        const newDirectory = new Directory({
            name: name,
            user_create: mongoose.Types.ObjectId(user_create),
            user_update: mongoose.Types.ObjectId(user_create),
            parent_directory: parent_directory,
            date_create: date
        });

        return await newDirectory.save();
    }

    async update(id, fields) {
        let Directory = await this.getById(id);
        return await super.update(Directory, fields);
    }

    async delete(id) {
        let Directory = await this.getById(id);
        return await super.softDelete(Directory);
    }

    async getDirectoryByParent(parentId, userId, deleted = false) {
        parentId = parentId === '0' || parentId === null || parentId === undefined ? null : mongoose.Types.ObjectId(parentId);
        if (deleted) return await Directory.find({user_create: userId, deleted: true});
        if (!parentId) return await Directory.find({
            parent_directory: parentId,
            user_create: userId,
            deleted: deleted
        });
        return await Directory.find({parent_directory: parentId, deleted: deleted});

    }

    async getFilesByDirectory(parentId, userId, deleted = false) {
        parentId = parentId === '0' || parentId === null || parentId === undefined ? null : mongoose.Types.ObjectId(parentId);
        let match;
        if (deleted) match = {deleted: true, user_create: mongoose.Types.ObjectId(userId)};
        else if (parentId === null) match = {
            directory: parentId,
            deleted: false,
            user_create: mongoose.Types.ObjectId(userId)
        };
        else match = {directory: parentId, deleted: false};

        return await File.aggregate([
            {$match: match},
            {$sort: {"file_version": -1}},
            {
                $group: {
                    _id: "$name",
                    name: {$first: "$name"},
                    file_version: {$first: "$file_version"},
                    file_id: {$first: "$_id"},
                    date_create: {$first: "$date_create"},
                    file_type: {$first: "$file_type"},
                    user_create: {$first: "$user_create"},
                    user_update: {$first: "$user_update"},
                    directory: {$first: "$directory"},
                    createdAt: {$first: "$createdAt"},
                    updatedAt: {$first: "$updatedAt"},
                }
            }
        ]);
        // return await File.find( {directory: id, user_create: idUser} ).sort( {file_version: -1} );
        // return await fileController.getAll({directory: id, user_create: idUser});
    }

    async getTreeDirectory(id, deleted = false) {
        id = id === '0' || id === null || id === undefined ? null : mongoose.Types.ObjectId(id);
        if (!id) return [{name: 'Home', _id: '0'}];
        const directory = await Directory.findOne({_id: id, deleted: deleted});

        let res = await this.getTreeDirectory(directory.parent_directory);
        res.push(directory);
        return res;
    }

    async getByParentId(id) {
        id = id === '0' || id === null || id === undefined ? null : mongoose.Types.ObjectId(id);
        return await Directory.find({parent_directory: id, deleted: false}).populate('user_create');
    }

    async getByParentIdNoUser(id) {
        id = id === '0' || id === null || id === undefined ? null : mongoose.Types.ObjectId(id);
        return await Directory.find({parent_directory: mongoose.Types.ObjectId(id), deleted: false});
    }

    async getByUserCreate(id) {
        id = id === '0' || id === null || id === undefined ? null : mongoose.Types.ObjectId(id);
        return await Directory.find({user_create: mongoose.Types.ObjectId(id), deleted: false});
    }

    async getFilesByDirectoryNoUser(id) {
        return await fileController.getAll({directory: mongoose.Types.ObjectId(id)});
    }

    async getAll(options) {
        return await Directory.find({deleted: false}, options).populate('user_create');
    }

    async isDeleted(id) {
        if (id === '0' || id === null || id === undefined) return false;
        const directory = await Directory.findOne({_id: mongoose.Types.ObjectId(id), deleted: false});
        if (!!directory) return this.isDeleted(directory.parent_directory);
        return true;
    }

    async createTree(idDirectory, currentPath = null, directoryName = null, tempDir = null) {
        const isDeleted = await this.isDeleted(idDirectory);
        if (!isDeleted) {
            const directory = await this.softGetById(idDirectory);
            if (!!!currentPath && !!!directoryName) {
                tempDir       = uuid();
                currentPath   = `${process.env.FOLDERS_DOWNLOAD_PATH}${tempDir}/`;
                directoryName = directory.name;
            } else {
                currentPath += `${directory.name}/`;
            }
            mkdirp(currentPath);
            const children = await this.getByParentId(idDirectory);
            const files    = await File.find({directory: mongoose.Types.ObjectId(idDirectory), deleted: false});

            for (let child of children) {
                const res = await this.createTree(child._id, currentPath, directoryName, tempDir);
            }
            for (let file of files) {
                const filePath    = process.env.FILES_PATH + file._id;
                const newFilePath = `${currentPath}${file.name}`;
                try {
                    fs.copyFileSync(filePath, newFilePath);
                } catch {
                    console.log('error');
                }
            }

            return {path: process.env.FOLDERS_DOWNLOAD_PATH + tempDir, name: directoryName};
        }
        return false;
    }

    async zip(idDirectory) {
        const result = await this.createTree(idDirectory);
        const zip    = new AdmZip();
        if (result) {
            const zipPath = result.path + '.zip';
            zip.addLocalFolder(result.path);
            zip.writeZip(zipPath);
            rimraf.sync(result.path);

            return zipPath;
        }

        return null;
    }

    async undelete(id) {
        return await Directory.updateOne({_id: id}, {deleted: false});
    }

    async undeleteSubFolders(Dir) {
        const sub_folders = await Directory.find({parent_directory: Dir._id});
        const start       = async () => {
            await this.asyncForEach(sub_folders, async (folder) => {
                if (await this.hasSubFolders(folder)) {
                    await this.undeleteSubFolders(folder);
                }
                await Directory.update({_id: folder._id}, {deleted: false})
            });
        };

        await start();
    }

    async hardDelete(id) {
        let Dir = await this.getById(id);
        this.deleteAllLinksTo(Dir);
        this.deleteAllElementsInto(Dir);
        return await Directory.deleteMany({_id: id});
    }

    async deleteAllLinksTo(Dir) {
        try {
            await this.deleteLinks(Dir);
            await this.deleteRights(Dir);
            await this.deleteHistorys(Dir);
        } catch (e) {
            console.log(e.toString());
            return false;
        }
        return true;
    }

    async deleteLinks(Dir) {
        return await Directory.deleteMany({directory: Dir._id});
    }

    async deleteRights(Dir) {
        return await Directory.deleteMany({directory: Dir._id});
    }

    async deleteHistorys(Dir) {
        return await Directory.deleteMany({directory: Dir._id});
    }

    async deleteAllElementsInto(Dir) {
        const sub_folders = await Directory.find({parent_directory: Dir._id});
        const start       = async () => {
            await this.asyncForEach(sub_folders, async (folder) => {
                await this.deleteAllLinksTo(folder);
                if (await this.hasSubFolders(folder)) {
                    await this.deleteAllElementsInto(folder);
                }
                await Directory.deleteOne({_id: folder._id});
            });
        };

        await start();
    }

    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    async hasSubFolders(folder) {
        const result = await Directory.find({parent_directory: folder._id});
        return result.length > 0;
    }

    async softDeleteAllElementsInto(dir) {
        const sub_folders = await Directory.find({parent_directory: dir._id});
        const start       = async () => {
            await this.asyncForEach(sub_folders, async (folder) => {
                if (await this.hasSubFolders(folder)) {
                    await this.softDeleteAllElementsInto(folder);
                }
                await super.softDelete(folder);
            });
        };

        await start();
    }

}

module.exports = new DirectoryController();
