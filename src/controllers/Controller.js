'use strict';

class Controller {

    constructor(model) {
        this.model = model;
    }

    async getAll(where) {
        return await this.model.find(where);
    }

    async getById(id) {
        return await this.model.findOne({_id: id});
    }

    async update(model, fields) {

        if (model === undefined || model === null) {
            return undefined;
        }

        const res = await this.model.findOneAndUpdate(
            {
                _id: model._id
            }, {
                $set: fields
            }, {
                new : true
            });

        return res;
    }

    async delete(model) {
        if(model === undefined){
            return undefined;
        }
        return await this.model.findOneAndDelete({_id : model._id}, (err) => {
            if (err) {
                console.error(err);
                return false;
            }
            else return true;
        });
    }
}

module.exports = Controller;
