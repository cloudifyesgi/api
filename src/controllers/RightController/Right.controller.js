'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const Right = models.Right;

class RightController extends Controller{

    constructor() {
        super(Right);
    }

    async create(view_right,update_right) {
        let newRight = new Right({
            view_right:view_right,update_right:update_right
        });
        await newRight.save();
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
