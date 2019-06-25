const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
    action: {
        type: String
    },
    file: {
        type:Schema.Types.ObjectId,
        ref:'File'
    },
    directory: {
        type:Schema.Types.ObjectId,
        ref:'Directory'
    },
    parent: {
        type:Schema.Types.ObjectId,
        ref:'Directory'
    },
    user: {
        type:Schema.Types.ObjectId,
        ref:'User'
    }
}, {
    timestamps: true,
    autoCreate: true,
    collection: 'History'
});

class HistoryClass {

    constructor() {}
}

HistorySchema.loadClass(HistoryClass);
const History = mongoose.model('History', HistorySchema);

module.exports = History;
