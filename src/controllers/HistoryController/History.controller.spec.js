'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let HistoryController;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    HistoryController = require('./History.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('History Controller', () => {
    describe('#create()', () => {
        it('should return new History', async () => {
            const History = await HistoryController.create('string','2019-04-20');
            expect(History).to.not.be.undefined;
        });
    });
    describe('#getAll()', () => {
        it('should return History array', async () => {
            const Historys = await HistoryController.getAll();
            expect(Historys).to.be.an('array');
            expect(Historys).to.have.length(1);
        });
    });

    describe('#getById()', () => {
        it('should return an History', async () => {
            let test = await HistoryController.getAll();
            test = test[0];
            const History = await HistoryController.getById(test._id);
            expect(History).to.not.be.null;
        });

        it('should return undefined', async () => {
            const History = await HistoryController.getById(mongoose.Types.ObjectId('111111111111'));
            expect(History).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return History updated', async () => {
            let test = await HistoryController.getAll();
            test = test[0];
            const fields = {
                name: 'Luis'
            };
            const History = await HistoryController.update(test._id, fields);
            expect(History).to.not.be.undefined;
            expect(History.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const History = await HistoryController.update(mongoose.Types.ObjectId('111111111111'), fields);
            expect(History).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            let test = await HistoryController.getAll();
            test = test[0];
            const History = await HistoryController.delete(test._id);
            expect(History).to.not.be.undefined;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.History.drop();
    mongoose.connection.close();
});
