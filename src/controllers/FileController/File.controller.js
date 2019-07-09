'use strict';

const models     = require('../../models');
const Controller = require('../Controller');
const File       = models.File;
const mongoose   = require('mongoose');
const fs         = require('fs');

const Link = models.Link;
const Right = models.Right;
const History = models.History;


class FileController extends Controller {

    constructor() {
        super(File);
    }

    async create(name, date_create, file_version, file_type, user, parent_directory) {
        let newFile = new File({
            name: name,
            date_create: date_create,
            file_version: file_version,
            file_type: file_type,
            user_create: mongoose.Types.ObjectId(user),
            directory: mongoose.Types.ObjectId(parent_directory)
        });
        return await newFile.save();
    }

    async update(id, fields) {
        let File = await this.getById(id);
        return await super.update(File, fields);
    }

    async delete(id) {
        let File = await this.softGetById(id);
        return await super.softDeleteAllVersions(File);
    }

    async isFirstVersion(name, directory) {
        let exists = await File.find({name: name, directory: directory });
        return exists[0] === undefined;
    }

    async getLastVersion(name, directory) {
        let lastVersion = await File.find({
            name: name,
            directory: directory
        }).sort({file_version: -1}).limit(1);
        if (lastVersion[0] === undefined) {
            return 0;
        } else {
            return lastVersion[0];
        }
    }

    async getAllVersions(name, directory) {
        return await File.find({name: name, directory:directory, deleted: false}).sort({file_version: 1})
            .populate('user_create');
    }

    async getVersion(name, number, directory) {
        let file          = await File.findOne({name: name, file_version: number, directory:directory, deleted: false});
        const lastVersion = await this.getLastVersion(name, file.directory);
        let original_id   = file._id;
        file.file_version = parseInt(lastVersion.file_version, 10) + 1;
        file._id          = new mongoose.Types.ObjectId();
        fs.createReadStream(process.env.FILES_PATH + original_id).pipe(fs.createWriteStream(process.env.FILES_PATH + file._id));
        if (await this.redirectTarget(lastVersion, file) === false) {
            console.log('Error while redirecting targets in revert method');
        }
        return await File.insertMany(file);
    }

    async undeleteOldVersion(name, directory) {
        try {
            await File.updateMany({name: name, directory: directory}, {$set: { "deleted": false}})
        }
        catch (e) {
            console.log(e.toString());
            return false
        }
        return true;
    }

    async redirectTarget(lastVersion, newVersion) {
        try {
            await this.redirectLinks(lastVersion, newVersion);
            await this.redirectRights(lastVersion, newVersion);
            await this.redirectHistorys(lastVersion, newVersion);
        }
        catch (e) {
            console.log(e.toString());
            return false;
        }
        return true;

    }

    async redirectLinks(lastVersion, newVersion) {
        return await Link.updateMany({file:lastVersion._id}, {file:newVersion._id});
    }

    async redirectRights(lastVersion, newVersion) {
        return await Right.updateMany({file:lastVersion._id}, {file:newVersion._id});
    }

    async redirectHistorys(lastVersion, newVersion) {
        return await History.updateMany({file:lastVersion._id}, {file:newVersion._id});
    }
}

module.exports = new FileController();
