'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const History = models.History;

class HistoryController extends Controller{

    constructor() {
        super(History);
    }

    async create(action,date) {
        let newHistory = new History({
            action:action,date:date
        });
        return await newHistory.save();
    }

    async update(id, fields) {
        let History = await this.getById(id);
        return await super.update(History, fields);
    }

    async delete(id) {
        let History = await this.getById(id);
        return await super.delete(History);
    }

}

module.exports = new HistoryController();
