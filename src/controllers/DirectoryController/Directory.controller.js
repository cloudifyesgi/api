'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const Directory = models.Directory;
const fileController = require('../FileController/File.controller');
const mongoose = require('mongoose');

class DirectoryController extends Controller {

    constructor() {
        super(Directory);
    }

    async create(name, user_create, parent_directory) {
        parent_directory = parent_directory === '0' ? null : mongoose.Types.ObjectId(parent_directory);
        const newDirectory = new Directory({
            name: name,
            user_create: mongoose.Types.ObjectId(user_create),
            user_update: mongoose.Types.ObjectId(user_create),
            parent_directory: parent_directory,
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

    async getDirectoryByParent(parentId, idUser) {
        parentId = parentId === '0' ? null : mongoose.Types.ObjectId(parentId);
        return await this.model.find({parent_directory: parentId, user_create: idUser});
    }

    async getFilesByDirectory(id, idUser) {
        id = id === '0' ? null : mongoose.Types.ObjectId(id);
        return await fileController.getAll({directory: id, user_create: idUser});
    }

    async getTreeDirectory(id) {
        console.log(id);
        id = id === '0' || id === undefined || id === null ? null : mongoose.Types.ObjectId(id);
        if (!id) return [{name: 'Home', _id: '0'}];
        console.log(id);
        const directory = await this.getById(id);
        let res = await this.getTreeDirectory(directory.parent_directory);
        res.push(directory);
        return res;
    }
}

module.exports = new DirectoryController();
