'use strict';

const models     = require('../../models');
const Controller = require('../Controller');
const Docify     = models.Docify;
const mongoose   = require('mongoose');


class DocifyController extends Controller {

    constructor() {
        super(Docify);
    }

    async create(name, user, parent_directory) {
        parent_directory = parent_directory === '0' ? null : mongoose.Types.ObjectId(parent_directory);
        let newFile      = new Docify({
            name: name,
            user_create: mongoose.Types.ObjectId(user),
            user_update: mongoose.Types.ObjectId(user),
            directory: mongoose.Types.ObjectId(parent_directory)
        });
        return await newFile.save();
    }

    async update(id, fields) {
        let File      = await this.getById(id);
        return await super.update(File, fields);
    }

    async delete(id) {
        let File = await this.softGetById(id);
        return await super.softDelete(File);
    }
}

module.exports = new DocifyController();
