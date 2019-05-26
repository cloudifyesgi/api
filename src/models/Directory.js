const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DirectorySchema = new Schema({
    name: {
        type: String
    },
    path: {
        type: String
    },
    date_create: {
        type: Date
    },
    user_create: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    user_update: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    parent_directory: {
        type: Schema.Types.ObjectId,
        ref: 'Directory'
    }
}, {
    autoCreate: true,
    collection: 'Directory'
});

class DirectoryClass {

    constructor() {}
}

DirectorySchema.loadClass(DirectoryClass);
const Directory = mongoose.model('Directory', DirectorySchema);

module.exports = Directory;
