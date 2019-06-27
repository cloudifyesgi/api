'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const Directory = models.Directory;
const fileController = require('../FileController/File.controller');
const mongoose = require('mongoose');
const File = models.File;

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
        return await File.aggregate( [
            {$match: { directory: id}},
            {$sort: {"file_version": -1}},
            {$group: {
                _id: "$name",
                name: {$first: "$name"},
                file_version: {$first: "$file_version"},
                file_id: {$first: "$_id"},
                date_create: {$first: "$date_create"},
                file_type: {$first: "$file_type"},
                user_create: {$first: "$user_create"},
                user_update: {$first: "$user_update"},
                directory: {$first: "$directory"},
            }}
        ]);
        // return await File.find( {directory: id, user_create: idUser} ).sort( {file_version: -1} );
        // return await fileController.getAll({directory: id, user_create: idUser});
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
