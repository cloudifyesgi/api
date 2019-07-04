'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const Right = models.Right;

class RightController extends Controller{

    constructor() {
        super(Right);
    }

    async create(right,directory,file,user) {
        let newRight = new Right({
            right:right,directory:directory,file:file,user:user
        });
        return await newRight.save();
    }

    async update(id, fields) {
        let Right = await this.getById(id);
        return await super.update(Right, fields);
    }

    async delete(id) {
        let Right = await this.getById(id);
        return await super.delete(Right);
    }

}

module.exports = new RightController();
