const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
    action: {
        required: true,
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
    child_directory: {
        type:Schema.Types.ObjectId,
        ref:'Directory'
    },
    child_file: {
        type:Schema.Types.ObjectId,
        ref:'File'
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
