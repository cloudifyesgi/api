'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const Directory = models.Directory;

class DirectoryController extends Controller{

    constructor() {
        super(Directory);
    }

    async create(name,path,date_create) {
        let newDirectory = new Directory({
            name:name,path:path,date_create:date_create
        });
        return await newDirectory.save();
    }

    async update(id, fields) {
        let Directory = await this.getById(id);
        return await super.update(Directory, fields);
    }

    async delete(id) {
        let Directory = await this.getById(id);
        return await super.delete(Directory);
    }

}

module.exports = new DirectoryController();
