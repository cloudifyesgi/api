'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../utils').db.test_connection;
const mongoose = require('mongoose');


dotenv.config();
let userController;
let User;

const expect = require('chai').expect;


before(async function() {
    test_connection();
    User = require('../../models').User;
    userController = require('./User.controller');
    await mongoose.connection.collections.User.drop();
});

describe('User Controller', () => {
    describe('#create()', () => {
        it('should return new User', async () => {
            const user = await userController.create('l@l.fr', 'test');
            expect(user).to.not.be.undefined;
        });
    });
    describe('#getAll()', () => {
        it('should return User array', async () => {
            const users = await userController.getAll();
            expect(users).to.be.an('array');
            //TODO check length of result
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.User.drop();
    mongoose.connection.close();
});
