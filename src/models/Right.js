const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RightSchema = new Schema({
    right: {
        type: String
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
