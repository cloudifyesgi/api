'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let SynchronizationController;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    SynchronizationController = require('./Synchronization.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('Synchronization Controller', () => {
    describe('#create()', () => {
        it('should return new Synchronization', async () => {
            const Synchronization = await SynchronizationController.create('string');
            expect(Synchronization).to.not.be.undefined;
        });
    });
    describe('#getAll()', () => {
        it('should return Synchronization array', async () => {
            const Synchronizations = await SynchronizationController.getAll();
            expect(Synchronizations).to.be.an('array');
            expect(Synchronizations).to.have.length(1);
        });
    });

    describe('#getById()', () => {
        it('should return an Synchronization', async () => {
            let test = await SynchronizationController.getAll();
            test = test[0];
            const Synchronization = await SynchronizationController.getById(test._id);
            expect(Synchronization).to.not.be.null;
        });

        it('should return undefined', async () => {
            const Synchronization = await SynchronizationController.getById(mongoose.Types.ObjectId('111111111111'));
            expect(Synchronization).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return Synchronization updated', async () => {
            let test = await SynchronizationController.getAll();
            test = test[0];
            const fields = {
                name: 'Luis'
            };
            const Synchronization = await SynchronizationController.update(test._id, fields);
            expect(Synchronization).to.not.be.undefined;
            expect(Synchronization.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const Synchronization = await SynchronizationController.update(mongoose.Types.ObjectId('111111111111'), fields);
            expect(Synchronization).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            let test = await SynchronizationController.getAll();
            test = test[0];
            const Synchronization = await SynchronizationController.delete(test._id);
            expect(Synchronization).to.not.be.undefined;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.Synchronization.drop();
    mongoose.connection.close();
});
