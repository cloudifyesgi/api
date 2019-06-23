'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let RightController;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    RightController = require('./Right.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('Right Controller', () => {
    describe('#create()', () => {
        it('should return new Right', async () => {
            const Right = await RightController.create(true,true);
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
            let test = await RightController.getAll();
            test = test[0];
            const Right = await RightController.getById(test._id);
            expect(Right).to.not.be.null;
        });

        it('should return undefined', async () => {
            const Right = await RightController.getById(mongoose.Types.ObjectId('111111111111'));
            expect(Right).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return Right updated', async () => {
            let test = await RightController.getAll();
            test = test[0];
            const fields = {
                name: 'Luis'
            };
            const Right = await RightController.update(test._id, fields);
            expect(Right).to.not.be.undefined;
            expect(Right.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const Right = await RightController.update(mongoose.Types.ObjectId('111111111111'), fields);
            expect(Right).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            let test = await RightController.getAll();
            test = test[0];
            const Right = await RightController.delete(test._id);
            expect(Right).to.not.be.undefined;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.Right.drop();
    mongoose.connection.close();
});
