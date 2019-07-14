'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const Transaction = models.Transaction;
const mongoose = require('mongoose');
const QuotaController = require('../QuotaController/Quota.controller');
const SubscriptionController = require('../SubscriptionController/Subscription.controller');

class TransactionController extends Controller{

    constructor() {
        super(Transaction);
    }

    async create(type,reference,path,name_subscription,price_subscription,subscription,user) {
        let newTransaction = new Transaction({
            date:Date.now(),type:type,reference:reference,path:path,name_subscription:name_subscription,price_subscription:price_subscription,subscription:mongoose.Types.ObjectId(subscription),user:mongoose.Types.ObjectId(user)
        });
        let currentSubscription = await QuotaController.getCurrentSubscription(user);
        await this.update(currentSubscription._id,{date_end: Date.now()});
        return await newTransaction.save();
    }

    async userFirstTransaction(user){
        let freeSubscription = await SubscriptionController.getFreeSubscription();
        let newTransaction = new Transaction({
            date:Date.now(),type:"temp",reference:"temp",path:"temp",name_subscription:freeSubscription.name,price_subscription:0,subscription:mongoose.Types.ObjectId(freeSubscription._id),user:mongoose.Types.ObjectId(user)
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
