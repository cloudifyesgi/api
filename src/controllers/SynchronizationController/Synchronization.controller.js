'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const Synchronization = models.Synchronization;
const mongoose = require('mongoose');

class SynchronizationController extends Controller{

    constructor() {
        super(Synchronization);
    }

    async create(local_path,directory,user_id) {
        let newSynchronization = new Synchronization({
            local_path:local_path,
            directory: mongoose.Types.ObjectId(directory),
            user: mongoose.Types.ObjectId(user_id)
        });
        return await newSynchronization.save();
    }

    async update(id, fields) {
        let Synchronization = await this.getById(id);
        return await super.update(Synchronization, fields);
    }

    async delete(id) {
        let Synchronization = await this.getById(id);
        return await super.delete(Synchronization);
    }

    async getByDirectory(directory){
        return await Synchronization.find({directory: mongoose.Types.ObjectId(directory)});
    }

}

module.exports = new SynchronizationController();
