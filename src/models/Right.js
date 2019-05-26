const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RightSchema = new Schema({
    view_right: {
        type: Boolean
    },
    update_right: {
        type: Boolean
    },
    directory: {
        type:Schema.Types.ObjectId,
        ref:'Directory'
    },
    file: {
        type:Schema.Types.ObjectId,
        ref:'File'
    },
    user: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    user_group: {
        type:Schema.Types.ObjectId,
        ref:'UserGroup'
    }
}, {
    autoCreate: true,
    collection: 'Right'
});

class RightClass {

    constructor() {}
}

RightSchema.loadClass(RightClass);
const Right = mongoose.model('Right', RightSchema);

module.exports = Right;
