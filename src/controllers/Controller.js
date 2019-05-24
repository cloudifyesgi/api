'use strict';

class Controller {

    constructor(model) {
        this.model = model;
    }

    async getAll(options) {
        return await this.model.find({}, options);
    }

    async getById(id) {
        return await this.model.findOne({id: id});
    }

    async update(model, fields) {

        if (model === undefined || model === null) {
            return undefined;
        }

        return await this.model.findOneAndUpdate(
            {
                email: model.email
            }, {
                $set: fields
            }, {
                new: false
            }, (err, model) => {
                if (err) {
                    console.log(err);
                    return undefined;
                }
            });
    }
}

module.exports = Controller;
