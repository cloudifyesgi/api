'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const Directory = models.Directory;
const mongoose = require('mongoose');

class DirectoryController extends Controller{

    constructor() {
        super(Directory);
    }

    async create(name,path,date_create,user_create,user_update,parent_directory) {
        let newDirectory = new Directory({
            name:name,
            path:path,
            date_create:date_create,
            user_create:mongoose.Types.ObjectId(user_update),
            user_update:mongoose.Types.ObjectId(user_update),
            parent_directory: parent_directory !== undefined ? mongoose.Types.ObjectId(parent_directory) : undefined,
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
