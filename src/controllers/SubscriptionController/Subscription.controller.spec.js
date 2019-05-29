'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let SubscriptionController;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    SubscriptionController = require('./Subscription.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('Subscription Controller', () => {
    describe('#create()', () => {
        it('should return new Subscription', async () => {
            const Subscription = await SubscriptionController.create('string',67,67,67,67,'string',67,true);
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
            let test = await SubscriptionController.getAll();
            test = test[0];
            const Subscription = await SubscriptionController.getById(test._id);
            expect(Subscription).to.not.be.null;
        });

        it('should return undefined', async () => {
            const Subscription = await SubscriptionController.getById(mongoose.Types.ObjectId('111111111111'));
            expect(Subscription).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return Subscription updated', async () => {
            let test = await SubscriptionController.getAll();
            test = test[0];
            const fields = {
                name: 'Luis'
            };
            const Subscription = await SubscriptionController.update(test._id, fields);
            expect(Subscription).to.not.be.undefined;
            expect(Subscription.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const Subscription = await SubscriptionController.update(mongoose.Types.ObjectId('111111111111'), fields);
            expect(Subscription).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            let test = await SubscriptionController.getAll();
            test = test[0];
            const Subscription = await SubscriptionController.delete(test._id);
            expect(Subscription).to.not.be.undefined;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.Subscription.drop();
    mongoose.connection.close();
});
