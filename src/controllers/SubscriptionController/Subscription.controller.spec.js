'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let SubscriptionController;
let Subscription;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    SubscriptionController = require('./Subscription.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('Subscription Controller', () => {
    describe('#create()', () => {
        it('should return new Subscription', async () => {
            const Subscription = await SubscriptionController.create(/**/);
            expect(Subscription).to.not.be.undefined;

        });
    });
    describe('#getAll()', () => {
        it('should return Subscription array', async () => {
            const Subscriptions = await SubscriptionController.getAll();
            expect(Subscriptions).to.be.an('array');
            expect(Subscriptions).to.have.length(1);
        });
    });

    describe('#getById()', () => {
        it('should return an Subscription', async () => {

            const Subscription = await SubscriptionController.getById(/**/);
            expect(Subscription).to.not.be.undefined;
        });

        it('should return undefined', async () => {
            const Subscription = await SubscriptionController.getById(/**/);
            expect(Subscription).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return Subscription updated', async () => {
            const fields = {
                name: 'Luis'
            };
            const Subscription = await SubscriptionController.update(/**/, fields);
            expect(Subscription).to.not.be.undefined;
            expect(Subscription.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const Subscription = await SubscriptionController.update(/**/, fields);
            expect(Subscription).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            const Subscription = await SubscriptionController.delete(/**/);
            expect(Subscription).to.be.null;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.Subscription.drop();
    mongoose.connection.close();
});
