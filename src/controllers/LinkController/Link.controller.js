'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const Link = models.Link;

class LinkController extends Controller{

    constructor() {
        super(Link);
    }

    async create(link,link_type,expiry_date,is_activated,link_password,user,directory,file) {
        let newLink = new Link({
            link:link,
            link_type:link_type,
            expiry_date:expiry_date,
            is_activated:is_activated,
            link_password:link_password,
            user:user,
            directory:directory,
            file:file
        });
        return await newLink.save();
    }

    async update(id, fields) {
        let Link = await this.getById(id);
        return await super.update(Link, fields);
    }

    async delete(id) {
        let Link = await this.getById(id);
        return await super.delete(Link);
    }

    async getByFileId(id) {
        let link = await Link.findOne({file: id});
        return link;

    }

    async getByDirId(id) {
        let link = await Link.findOne({directory: id});
        return link;
    }
}

module.exports = new LinkController();
