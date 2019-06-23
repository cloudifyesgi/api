'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let DirectoryController;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    DirectoryController = require('./Directory.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('Directory Controller', () => {
    describe('#create()', () => {
        it('should return new Directory', async () => {
            const Directory = await DirectoryController.create('string','string','2019-04-20');
            expect(Directory).to.not.be.undefined;
        });
    });
    describe('#getAll()', () => {
        it('should return Directory array', async () => {
            const Directorys = await DirectoryController.getAll();
            expect(Directorys).to.be.an('array');
            expect(Directorys).to.have.length(1);
        });
    });

    describe('#getById()', () => {
        it('should return an Directory', async () => {
            let test = await DirectoryController.getAll();
            test = test[0];
            const Directory = await DirectoryController.getById(test._id);
            expect(Directory).to.not.be.null;
        });

        it('should return undefined', async () => {
            const Directory = await DirectoryController.getById(mongoose.Types.ObjectId('111111111111'));
            expect(Directory).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return Directory updated', async () => {
            let test = await DirectoryController.getAll();
            test = test[0];
            const fields = {
                name: 'Luis'
            };
            const Directory = await DirectoryController.update(test._id, fields);
            expect(Directory).to.not.be.undefined;
            expect(Directory.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const Directory = await DirectoryController.update(mongoose.Types.ObjectId('111111111111'), fields);
            expect(Directory).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            let test = await DirectoryController.getAll();
            test = test[0];
            const Directory = await DirectoryController.delete(test._id);
            expect(Directory).to.not.be.undefined;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.Directory.drop();
    mongoose.connection.close();
});
