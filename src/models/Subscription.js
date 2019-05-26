const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
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
    status: {
        type: Boolean
    }
}, {
    autoCreate: true,
    collection: 'Subscription'
});

class SubscriptionClass {

    constructor() {}
}

SubscriptionSchema.loadClass(SubscriptionClass);
const Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = Subscription;