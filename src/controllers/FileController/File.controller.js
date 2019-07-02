'use strict';

const models     = require('../../models');
const Controller = require('../Controller');
const File       = models.File;
const mongoose   = require('mongoose');
const fs         = require('fs');


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
        return await super.softDelete(File);
    }

    async isFirstVersion(name, directory) {
        let exists = await File.find({name: name, directory: directory, deleted: false});
        return exists[0] === undefined;
    }

    async getLastVersion(name, directory) {
        let lastVersion = await File.find({
            name: name,
            directory: directory,
            deleted: false
        }).sort({file_version: -1}).limit(1);
        if (lastVersion[0] === undefined) {
            return 0;
        } else {
            return lastVersion[0].file_version;
        }
    }

    async getAllVersions(name) {
        return await File.find({name: name, deleted: false}).sort({file_version: 1})
            .populate('user_create');
    }

    async getVersion(name, number) {
        let file          = await File.findOne({name: name, file_version: number, deleted: false});
        const lastVersion = await this.getLastVersion(name, file.directory);
        let original_id   = file._id;
        file.file_version = lastVersion + 1;
        file._id          = new ObjectId();
        fs.createReadStream(process.env.FILES_PATH + original_id).pipe(fs.createWriteStream(process.env.FILES_PATH + file._id));
        return await File.insertMany(file);
    }
}

module.exports = new FileController();
