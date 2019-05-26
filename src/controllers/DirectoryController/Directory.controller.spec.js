'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let DirectoryController;
let Directory;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    DirectoryController = require('./Directory.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('Directory Controller', () => {
    describe('#create()', () => {
        it('should return new Directory', async () => {
            const Directory = await DirectoryController.create(/**/);
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

            const Directory = await DirectoryController.getById(/**/);
            expect(Directory).to.not.be.undefined;
        });

        it('should return undefined', async () => {
            const Directory = await DirectoryController.getById(/**/);
            expect(Directory).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return Directory updated', async () => {
            const fields = {
                name: 'Luis'
            };
            const Directory = await DirectoryController.update(/**/, fields);
            expect(Directory).to.not.be.undefined;
            expect(Directory.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const Directory = await DirectoryController.update(/**/, fields);
            expect(Directory).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            const Directory = await DirectoryController.delete(/**/);
            expect(Directory).to.be.null;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.Directory.drop();
    mongoose.connection.close();
});
