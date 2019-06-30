'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const File = models.File;
const mongoose = require('mongoose');


class FileController extends Controller{

    constructor() {
        super(File);
    }

    async create(name,date_create,file_version,file_type,user,parent_directory) {
        let newFile = new File({
            name:name,date_create:date_create,file_version:file_version,file_type:file_type,user_create:mongoose.Types.ObjectId(user),directory:mongoose.Types.ObjectId(parent_directory)
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

}

module.exports = new FileController();
