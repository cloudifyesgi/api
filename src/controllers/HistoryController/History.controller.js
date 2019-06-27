'use strict';
const mongoose   = require('mongoose');
const models     = require('../../models');
const Controller = require('../Controller');
const History    = models.History;

class HistoryController extends Controller {

    constructor() {
        super(History);
    }

    async create(action, directory, file, childDirectory, childFile, user) {
        directory      = directory ? mongoose.Types.ObjectId(directory) : null;
        file           = file ? mongoose.Types.ObjectId(file) : null;
        childDirectory = childDirectory === '0' || childDirectory === null || childDirectory === undefined ? null : mongoose.Types.ObjectId(childDirectory);
        childFile      = childFile === '0' || childFile === null || childFile === undefined ? null : mongoose.Types.ObjectId(childFile);
        let newHistory = new History({
            action: action,
            directory: directory,
            child_directory: childDirectory,
            childFile: childFile,
            file: file,
            user: user
        });
        return await newHistory.save();
    }

    async update(id, fields) {
        let history = await this.getById(id);
        return await super.update(history, fields);
    }

    async getByDirectories(directory) {
        return await History.find({directory: mongoose.Types.ObjectId(directory)}).populate('directory')
            .populate('child_directory')
            .populate('child_file')
            .populate('user');
    }
    async delete(id) {
        let history = await this.getById(id);
        return await super.delete(history);
    }

}

module.exports = new HistoryController();
