'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let SubscriptionStatusController;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    SubscriptionStatusController = require('./SubscriptionStatus.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('SubscriptionStatus Controller', () => {
    describe('#create()', () => {
        it('should return new SubscriptionStatus', async () => {
            const SubscriptionStatus = await SubscriptionStatusController.create('string',67,67,67,67,'string',67,'2019-04-20',67);
            expect(SubscriptionStatus).to.not.be.undefined;
        });
    });
    describe('#getAll()', () => {
        it('should return SubscriptionStatus array', async () => {
            const SubscriptionStatuss = await SubscriptionStatusController.getAll();
            expect(SubscriptionStatuss).to.be.an('array');
            expect(SubscriptionStatuss).to.have.length(1);
        });
    });

    describe('#getById()', () => {
        it('should return an SubscriptionStatus', async () => {
            let test = await SubscriptionStatusController.getAll();
            test = test[0];
            const SubscriptionStatus = await SubscriptionStatusController.getById(test._id);
            expect(SubscriptionStatus).to.not.be.null;
        });

        it('should return undefined', async () => {
            const SubscriptionStatus = await SubscriptionStatusController.getById(mongoose.Types.ObjectId('111111111111'));
            expect(SubscriptionStatus).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return SubscriptionStatus updated', async () => {
            let test = await SubscriptionStatusController.getAll();
            test = test[0];
            const fields = {
                name: 'Luis'
            };
            const SubscriptionStatus = await SubscriptionStatusController.update(test._id, fields);
            expect(SubscriptionStatus).to.not.be.undefined;
            expect(SubscriptionStatus.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const SubscriptionStatus = await SubscriptionStatusController.update(mongoose.Types.ObjectId('111111111111'), fields);
            expect(SubscriptionStatus).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            let test = await SubscriptionStatusController.getAll();
            test = test[0];
            const SubscriptionStatus = await SubscriptionStatusController.delete(test._id);
            expect(SubscriptionStatus).to.not.be.undefined;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.SubscriptionStatus.drop();
    mongoose.connection.close();
});
