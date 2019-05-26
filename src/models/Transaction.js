const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    date: {
        type: Date
    },
    type: {
        type: String
    },
    reference: {
        type: String
    },
    path: {
        type: String
    },
    name_subscription: {
        type: String
    },
    price_subscription: {
        type: Number
    },
    user: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    subscription: {
        type:Schema.Types.ObjectId,
        ref:'Subscription'
    }
}, {
    autoCreate: true,
    collection: 'Transaction'
});

class TransactionClass {

    constructor() {}
}

TransactionSchema.loadClass(TransactionClass);
const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
