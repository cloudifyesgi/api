'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const File = models.File;

class FileController extends Controller{

    constructor() {
        super(File);
    }

    async create(name,path,date_create,file_version,file_type) {
        let newFile = new File({
            name:name,path:path,date_create:date_create,file_version:file_version,file_type:file_type
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
