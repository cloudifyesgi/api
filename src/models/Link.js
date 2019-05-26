const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
    link: {
        type: String
    },
    link_type: {
        type: String
    },
    expiry_date: {
        type: Date
    },
    is_activated: {
        type: Boolean
    },
    link_password: {
        type: String
    },
    user: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    directory: {
        type:Schema.Types.ObjectId,
        ref:'Directory'
    },
    file: {
        type:Schema.Types.ObjectId,
        ref:'File'
    }
}, {
    autoCreate: true,
    collection: 'Link'
});

class LinkClass {

    constructor() {}
}

LinkSchema.loadClass(LinkClass);
const Link = mongoose.model('Link', LinkSchema);

module.exports = Link;
