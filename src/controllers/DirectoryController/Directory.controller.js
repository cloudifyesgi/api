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

    async create(name, user_create, parent_directory,date) {
        parent_directory = parent_directory === '0' ? null : mongoose.Types.ObjectId(parent_directory);
        const newDirectory = new Directory({
            name: name,
            user_create: mongoose.Types.ObjectId(user_create),
            user_update: mongoose.Types.ObjectId(user_create),
            parent_directory: parent_directory !== undefined ? mongoose.Types.ObjectId(parent_directory) : undefined,
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

    async getDirectoryByParent(parentId, idUser) {
        parentId = parentId === '0' ? null : mongoose.Types.ObjectId(parentId);
        return await this.model.find({parent_directory: parentId, user_create: idUser});
    }

    async getFilesByDirectory(id, idUser) {
        id = id === '0' ? null : mongoose.Types.ObjectId(id);
        return await File.aggregate( [
            {$match: { directory: id, deleted: false}},
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
                createdAt: {$first: "$createdAt"},
                updatedAt: {$first: "$updatedAt"},
            }}
        ]);
        // return await File.find( {directory: id, user_create: idUser} ).sort( {file_version: -1} );
        // return await fileController.getAll({directory: id, user_create: idUser});
    }

    async getTreeDirectory(id) {
        id = id === '0' || id === undefined || id === null ? null : mongoose.Types.ObjectId(id);
        if (!id) return [{name: 'Home', _id: '0'}];
        const directory = await this.getById(id);
        let res = await this.getTreeDirectory(directory.parent_directory);
        res.push(directory);
        return res;
    }

    async getByParentId(id){
        return await this.model.find({parent_directory: id}).populate('user_create');
    }

    async getByParentIdNoUser(id){
        return await this.model.find({parent_directory: mongoose.Types.ObjectId(id)});
    }

    async getFilesByDirectoryNoUser(id) {
        return await fileController.getAll({directory: mongoose.Types.ObjectId(id)});
    }

    async getAll(options) {
        return await this.model.find({}, options).populate('user_create');
    }

}

module.exports = new DirectoryController();