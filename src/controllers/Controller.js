'use strict';

class Controller {

    constructor(model) {
        this.model = model;
    }

    async getAll(options) {
        return await this.model.find({}, options);
    }

    async getByEmail(id) {
        return await this.model.findOne({id: id});
    }
}

module.exports = Controller;
