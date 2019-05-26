'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const Subscription = models.Subscription;

class SubscriptionController extends Controller{

    constructor() {
        super(Subscription);
    }

    async create(name,storage,file_number,file_size,price,description,directory_number,status) {
        let newSubscription = new Subscription({
            name:name,storage:storage,file_number:file_number,file_size:file_size,price:price,description:description,directory_number:directory_number,status:status
        });
        await newSubscription.save();
    }

    async update(id, fields) {
        let Subscription = await this.getById(id);
        return await super.update(Subscription, fields);
    }

    async delete(id) {
        let Subscription = await this.getById(id);
        return await super.delete(Subscription);
    }

}

module.exports = new SubscriptionController();
