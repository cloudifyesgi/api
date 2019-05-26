'use strict';

const models     = require('../../models');
const Controller = require('../Controller');
const User       = models.User;
const _          = require('lodash');


class UserController extends Controller {
    constructor() {
        super(User);
    }

    async create(email, password) {
        let newUser = new User({
            email: email,
            password: password
        });
        return await newUser.save();
    }

    async getByEmail(email) {
        return await User.findOne({email: email});
    }

    checkLevel(level) {
        return (req, res, next) => {
            if (req.user.rank >= 1) {
                next();
            } else res.status(401).end();
        }
    }

    async update(email, fields) {
        let user = await this.getByEmail(email);
        return await super.update(user, fields);
    }

    async delete(email) {
        let user = await this.getByEmail(email);
        return await super.delete(user);
    }

}

module.exports = new UserController();
