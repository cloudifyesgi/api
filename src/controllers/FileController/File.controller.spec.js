'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let FileController;
let File;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    FileController = require('./File.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('File Controller', () => {
    describe('#create()', () => {
        it('should return new File', async () => {
            const File = await FileController.create(/**/);
            expect(File).to.not.be.undefined;

        });
    });
    describe('#getAll()', () => {
        it('should return File array', async () => {
            const Files = await FileController.getAll();
            expect(Files).to.be.an('array');
            expect(Files).to.have.length(1);
        });
    });

    describe('#getById()', () => {
        it('should return an File', async () => {

            const File = await FileController.getById(/**/);
            expect(File).to.not.be.undefined;
        });

        it('should return undefined', async () => {
            const File = await FileController.getById(/**/);
            expect(File).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return File updated', async () => {
            const fields = {
                name: 'Luis'
            };
            const File = await FileController.update(/**/, fields);
            expect(File).to.not.be.undefined;
            expect(File.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const File = await FileController.update(/**/, fields);
            expect(File).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            const File = await FileController.delete(/**/);
            expect(File).to.be.null;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.File.drop();
    mongoose.connection.close();
});
