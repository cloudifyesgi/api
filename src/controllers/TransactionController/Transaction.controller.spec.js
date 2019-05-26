'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let TransactionController;
let Transaction;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    TransactionController = require('./Transaction.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('Transaction Controller', () => {
    describe('#create()', () => {
        it('should return new Transaction', async () => {
            const Transaction = await TransactionController.create(/**/);
            expect(Transaction).to.not.be.undefined;

        });
    });
    describe('#getAll()', () => {
        it('should return Transaction array', async () => {
            const Transactions = await TransactionController.getAll();
            expect(Transactions).to.be.an('array');
            expect(Transactions).to.have.length(1);
        });
    });

    describe('#getById()', () => {
        it('should return an Transaction', async () => {

            const Transaction = await TransactionController.getById(/**/);
            expect(Transaction).to.not.be.undefined;
        });

        it('should return undefined', async () => {
            const Transaction = await TransactionController.getById(/**/);
            expect(Transaction).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return Transaction updated', async () => {
            const fields = {
                name: 'Luis'
            };
            const Transaction = await TransactionController.update(/**/, fields);
            expect(Transaction).to.not.be.undefined;
            expect(Transaction.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const Transaction = await TransactionController.update(/**/, fields);
            expect(Transaction).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            const Transaction = await TransactionController.delete(/**/);
            expect(Transaction).to.be.null;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.Transaction.drop();
    mongoose.connection.close();
});
