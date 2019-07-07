'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const Transaction = models.Transaction;
const mongoose = require('mongoose');
const QuotaController = require('../QuotaController/Quota.controller');

class TransactionController extends Controller{

    constructor() {
        super(Transaction);
    }

    async create(date,type,reference,path,name_subscription,price_subscription,subscription,user) {
        let newTransaction = new Transaction({
            date:date,type:type,reference:reference,path:path,name_subscription:name_subscription,price_subscription:price_subscription,subscription:mongoose.Types.ObjectId(subscription),user:mongoose.Types.ObjectId(user)
        });
        let currentSubscription = await QuotaController.getCurrentSubscription(user).then( (data) =>{
            console.log(data);
            this.update(data._id,{date_end: Date.now()});
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
