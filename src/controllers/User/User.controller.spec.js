'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let userController;
let User;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    userController = require('./User.controller');
    //await mongoose.connection.collections.User.drop();
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
            expect(users).to.have.length(1);
        });
    });

    describe('#getByEmail()', () => {
        it('should return an User', async () => {
            const users = await userController.getByEmail('l@l.fr');
            expect(users).to.not.be.undefined;
        });

        it('should return undefined', async () => {
            const users = await userController.getByEmail('li@l.fr');
            expect(users).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return 1', async () => {
            const fields = {
                name: 'Luis'
            };
            const numAffected = await userController.update()
            expect(users).to.not.be.undefined;
        });

        it('should return undefined', async () => {
            const users = await userController.getByEmail('li@l.fr');
            expect(users).to.be.null;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.User.drop();
    mongoose.connection.close();
});
