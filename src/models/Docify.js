const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const DocifySchema = new Schema({
    name: {
        type: String,
        required: true
    },

    content: {
        type: String,
        default: null
    },
    user_create: {
        type:Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    user_update: {
        type:Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    directory: {
        type: Schema.Types.ObjectId,
        ref: 'Directory',
        required: true
    }
}, {
    timestamps: true,
    autoCreate: true,
    collection: 'Docify'
});

class DocifyClass {

    constructor() {}
}

DocifySchema.loadClass(DocifyClass);
DocifySchema.plugin(mongoose_delete, { deletedAt : true});
const Docify = mongoose.model('Docify', DocifySchema);

module.exports = Docify;
