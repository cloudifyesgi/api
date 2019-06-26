'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const File = models.File;
const ObjectId = require('mongodb').ObjectID;
const fs = require('fs');

class FileController extends Controller{

    constructor() {
        super(File);
    }

    async create(name,date_create,file_version,file_type,user_create,user_update,directory) {
        let newFile = new File({
            name:name,date_create:date_create,file_version:file_version,file_type:file_type,user_create:user_create,user_update:user_update,directory:directory
        });
        return await newFile.save();
    }

    async update(id, fields) {
        let File = await this.getById(id);
        return await super.update(File, fields);
    }

    async delete(id) {
        let File = await this.getById(id);
        return await super.delete(File);
    }

    async isFirstVersion(name, directory) {
        let exists = await File.find( { name: name, directory: directory} );
        return exists[0] === undefined;
    }

    async getLastVersion(name, directory) {
        let lastVersion = await File.find( { name: name, directory: directory} ).sort({ file_version: -1}).limit(1);
        if(lastVersion[0] === undefined) {
            return 0;
        }
        else {
            return lastVersion[0].file_version;
        }
    }

    async getAllVersions(name) {
        return await File.find( { name: name} ).sort( {file_version: 1} );
    }

    async getVersion(name, number) {
        let file =  await File.findOne( { name: name, file_version: number} );
        const lastVersion = await this.getLastVersion(name, file.directory);
        let original_id = file._id;
        file.file_version = lastVersion + 1;
        file._id = new ObjectId();
        fs.createReadStream(process.env.FILES_PATH + original_id).pipe(fs.createWriteStream(process.env.FILES_PATH + file._id));
        return await File.insertMany(file);
    }
}

module.exports = new FileController();
