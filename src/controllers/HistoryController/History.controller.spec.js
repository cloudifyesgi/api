'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let HistoryController;
let History;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    HistoryController = require('./History.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('History Controller', () => {
    describe('#create()', () => {
        it('should return new History', async () => {
            const History = await HistoryController.create(/**/);
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

            const History = await HistoryController.getById(/**/);
            expect(History).to.not.be.undefined;
        });

        it('should return undefined', async () => {
            const History = await HistoryController.getById(/**/);
            expect(History).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return History updated', async () => {
            const fields = {
                name: 'Luis'
            };
            const History = await HistoryController.update(/**/, fields);
            expect(History).to.not.be.undefined;
            expect(History.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const History = await HistoryController.update(/**/, fields);
            expect(History).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            const History = await HistoryController.delete(/**/);
            expect(History).to.be.null;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.History.drop();
    mongoose.connection.close();
});
