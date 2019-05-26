const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SynchronizationSchema = new Schema({
    local_path: {
        type: String
    },
    user: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    directory: {
        type: Schema.Types.ObjectId,
        ref: 'Directory'
    }
}, {
    autoCreate: true,
    collection: 'Synchronization'
});

class SynchronizationClass {

    constructor() {}
}

SynchronizationSchema.loadClass(SynchronizationClass);
const Synchronization = mongoose.model('Synchronization', SynchronizationSchema);

module.exports = Synchronization;
