'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let SubscriptionStatusController;
let SubscriptionStatus;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    SubscriptionStatusController = require('./SubscriptionStatus.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('SubscriptionStatus Controller', () => {
    describe('#create()', () => {
        it('should return new SubscriptionStatus', async () => {
            const SubscriptionStatus = await SubscriptionStatusController.create(/**/);
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

            const SubscriptionStatus = await SubscriptionStatusController.getById(/**/);
            expect(SubscriptionStatus).to.not.be.undefined;
        });

        it('should return undefined', async () => {
            const SubscriptionStatus = await SubscriptionStatusController.getById(/**/);
            expect(SubscriptionStatus).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return SubscriptionStatus updated', async () => {
            const fields = {
                name: 'Luis'
            };
            const SubscriptionStatus = await SubscriptionStatusController.update(/**/, fields);
            expect(SubscriptionStatus).to.not.be.undefined;
            expect(SubscriptionStatus.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const SubscriptionStatus = await SubscriptionStatusController.update(/**/, fields);
            expect(SubscriptionStatus).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            const SubscriptionStatus = await SubscriptionStatusController.delete(/**/);
            expect(SubscriptionStatus).to.be.null;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.SubscriptionStatus.drop();
    mongoose.connection.close();
});
