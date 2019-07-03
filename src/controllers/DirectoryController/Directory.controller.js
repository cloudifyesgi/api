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
            parent_directory: parent_directory,
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

    async getDirectoryByParent(parentId, userId, deleted = false) {
        parentId = parentId === '0' || parentId === null || parentId === undefined ? null : mongoose.Types.ObjectId(parentId);
        if(deleted) return await this.model.find({user_create: userId, deleted: deleted});
        if(!parentId) return await this.model.find({parent_directory: parentId, user_create: userId, deleted: deleted});
        return await this.model.find({parent_directory: parentId, deleted: deleted});

    }

    async getFilesByDirectory(parentId, userId, deleted = false) {
        parentId = parentId === '0' || parentId === null || parentId === undefined ? null : mongoose.Types.ObjectId(parentId);
        let match;
        console.log(userId);
        if(deleted)  match = {deleted: true, user_create: mongoose.Types.ObjectId(userId)};
        else if(parentId === null) match = { directory: parentId, deleted: false, user_create: mongoose.Types.ObjectId(userId)};
        else match = { directory: parentId, deleted: false};

        return await File.aggregate( [
            {$match: match},
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

    async getTreeDirectory(id, deleted = false) {
        id = id === '0' || id === null || id === undefined ? null : mongoose.Types.ObjectId(id);
        if (!id) return [{name: 'Home', _id: '0'}];
        const directory = await Directory.findOne({_id: id, deleted: deleted});

        let res = await this.getTreeDirectory(directory.parent_directory);
        res.push(directory);
        return res;
    }

    async getByParentId(id){
        id = id === '0' || id === null || id === undefined ? null : mongoose.Types.ObjectId(id);
        return await this.model.find({parent_directory: id, deleted: false}).populate('user_create');
    }

    async getByParentIdNoUser(id){
        id = id === '0' || id === null || id === undefined ? null : mongoose.Types.ObjectId(id);
        return await this.model.find({parent_directory: mongoose.Types.ObjectId(id), deleted: false});
    }

    async getFilesByDirectoryNoUser(id) {
        id = id === '0' || id === null || id === undefined ? null : mongoose.Types.ObjectId(id);
        return await fileController.getAll({directory: mongoose.Types.ObjectId(id), deleted: false});
    }

    async getAll(options) {
        return await this.model.find({deleted: false}, options).populate('user_create');
    }

    async isDeleted(id) {
        console.log(id);
        if(id === '0' || id === null || id === undefined) return false;
        console.log(id);
        const directory = await Directory.findOne({_id: mongoose.Types.ObjectId(id), deleted: false});
        if(!!directory) return this.isDeleted(directory.parent_directory);
        return true;
    }

}

module.exports = new DirectoryController();
