'use strict';

class Controller {

    constructor(model) {
        this.model = model;
    }

    async getAll(where) {
        return await this.model.find(where);
    }

    async softGetAll() {
        return await this.model.find({deleted: false});
    }
    async getById(id) {
        return await this.model.findOne({_id: id});
    }

    async softGetById(id) {
        return await this.model.findOne({_id: id, deleted: false});
    }

    async update(model, fields) {

        if (model === undefined || model === null) {
            return undefined;
        }

        return await this.model.findOneAndUpdate(
            {
                _id: model._id
            }, {
                $set: fields
            }, {
                new: true
            });
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

    async softDelete(model) {
        if(model === undefined){
            return undefined;
        }
        return await this.model.update({_id : model._id}, {deleted: true},(err) => {
            if (err) {
                console.error(err);
                return false;
            }
            else return true;
        });
    }

    async softDeleteAllVersions(model) {
        if(model === undefined){
            return undefined;
        }
        return await this.model.update({name: model.name, directory: model.directory}, {deleted: true}, (err) => {
            if (err) {
                console.log(err);
                return false;
            }
            else return true;
        });
    }

    async hardDeleteAllVersions(model) {
        if(model === undefined){
            return undefined;
        }
        return await this.model.deleteMany({name: model.name, directory: model.directory}, (err) => {
            if (err) {
                console.log(err);
                return false;
            }
            else return true;
        });
    }
}

module.exports = Controller;
