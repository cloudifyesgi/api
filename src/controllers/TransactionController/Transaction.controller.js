'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const Transaction = models.Transaction;

class TransactionController extends Controller{

    constructor() {
        super(Transaction);
    }

    async create(date,type,reference,path,name_subscription,price_subscription) {
        let newTransaction = new Transaction({
            date:date,type:type,reference:reference,path:path,name_subscription:name_subscription,price_subscription:price_subscription
        });
        return await newTransaction.save();
    }

    async update(id, fields) {
        let Transaction = await this.getById(id);
        return await super.update(Transaction, fields);
    }

    async delete(id) {
        let Transaction = await this.getById(id);
        return await super.delete(Transaction);
    }

}

module.exports = new TransactionController();
