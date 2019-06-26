const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    name: {
        type: String
    },
    date_create: {
        type: Date
    },
    file_version: {
        type: Number
    },
    file_type: {
        type: String
    },
    user_create: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    user_update: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    directory: {
        type: Schema.Types.ObjectId,
        ref: 'Directory'
    }
}, {
    autoCreate: true,
    collection: 'File'
});

class FileClass {

    constructor() {}
}

FileSchema.loadClass(FileClass);
const File = mongoose.model('File', FileSchema);

module.exports = File;
