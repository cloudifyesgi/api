'use strict';
const mongoose = require('mongoose');
const models     = require('../../models');
const Controller = require('../Controller');
const History    = models.History;

class HistoryController extends Controller {

    constructor() {
        super(History);
    }

    async create(action, parent, directory, file, user) {
        directory = directory ? mongoose.Types.ObjectId(directory) : null;
        file = file ? mongoose.Types.ObjectId(file) : null;
        parent = parent === '0' ? null : mongoose.Types.ObjectId(parent);
        let newHistory = new History({
            action: action,
            directory: directory,
            parent: parent,
            file: file,
            user: user
        });
        return await newHistory.save();
    }

    async update(id, fields) {
        let History = await this.getById(id);
        return await super.update(History, fields);
    }

    async delete(id) {
        let History = await this.getById(id);
        return await super.delete(History);
    }

}

module.exports = new HistoryController();
