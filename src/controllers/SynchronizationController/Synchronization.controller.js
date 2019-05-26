'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const Synchronization = models.Synchronization;

class SynchronizationController extends Controller{

    constructor() {
        super(Synchronization);
    }

    async create(local_path) {
        let newSynchronization = new Synchronization({
            local_path:local_path
        });
        await newSynchronization.save();
    }

    async update(id, fields) {
        let Synchronization = await this.getById(id);
        return await super.update(Synchronization, fields);
    }

    async delete(id) {
        let Synchronization = await this.getById(id);
        return await super.delete(Synchronization);
    }

}

module.exports = new SynchronizationController();
