const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionStatusSchema = new Schema({
    name: {
        type: String
    },
    storage: {
        type: Number
    },
    file_number: {
        type: Number
    },
    file_size: {
        type: Number
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    directory_number: {
        type: Number
    },
    update_date: {
        type: Date
    },
    update_type: {
        type: Number
    },
    subscription: {
        type:Schema.Types.ObjectId,
        ref:'Subscription'
    }
}, {
    autoCreate: true,
    collection: 'SubscriptionStatus'
});

class SubscriptionStatusClass {

    constructor() {}
}

SubscriptionStatusSchema.loadClass(SubscriptionStatusClass);
const SubscriptionStatus = mongoose.model('SubscriptionStatus', SubscriptionStatusSchema);

module.exports = SubscriptionStatus;
