'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let RightController;
let Right;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    RightController = require('./Right.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('Right Controller', () => {
    describe('#create()', () => {
        it('should return new Right', async () => {
            const Right = await RightController.create(/**/);
            expect(Right).to.not.be.undefined;

        });
    });
    describe('#getAll()', () => {
        it('should return Right array', async () => {
            const Rights = await RightController.getAll();
            expect(Rights).to.be.an('array');
            expect(Rights).to.have.length(1);
        });
    });

    describe('#getById()', () => {
        it('should return an Right', async () => {

            const Right = await RightController.getById(/**/);
            expect(Right).to.not.be.undefined;
        });

        it('should return undefined', async () => {
            const Right = await RightController.getById(/**/);
            expect(Right).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return Right updated', async () => {
            const fields = {
                name: 'Luis'
            };
            const Right = await RightController.update(/**/, fields);
            expect(Right).to.not.be.undefined;
            expect(Right.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const Right = await RightController.update(/**/, fields);
            expect(Right).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            const Right = await RightController.delete(/**/);
            expect(Right).to.be.null;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.Right.drop();
    mongoose.connection.close();
});
