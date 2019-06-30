'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const SubscriptionStatus = models.SubscriptionStatus;

class SubscriptionStatusController extends Controller{

    constructor() {
        super(SubscriptionStatus);
    }

    async create(name,storage,file_number,file_size,price,description,directory_number,update_date,update_type) {
        let newSubscriptionStatus = new SubscriptionStatus({
            name:name,storage:storage,file_number:file_number,file_size:file_size,price:price,description:description,directory_number:directory_number,update_date:update_date,update_type:update_type
        });
        return await newSubscriptionStatus.save();
    }

    async update(id, fields) {
        let SubscriptionStatus = await this.getById(id);
        return await super.update(SubscriptionStatus, fields);
    }

    async delete(id) {
        let SubscriptionStatus = await this.getById(id);
        return await super.delete(SubscriptionStatus);
    }

}

module.exports = new SubscriptionStatusController();
