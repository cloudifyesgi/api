'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let FileController;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    FileController = require('./File.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('File Controller', () => {
    describe('#create()', () => {
        it('should return new File', async () => {
            const File = await FileController.create('string','string','2019-04-20','string','string');
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
            let test = await FileController.getAll();
            test = test[0];
            const File = await FileController.getById(test._id);
            expect(File).to.not.be.null;
        });

        it('should return undefined', async () => {
            const File = await FileController.getById(mongoose.Types.ObjectId('111111111111'));
            expect(File).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return File updated', async () => {
            let test = await FileController.getAll();
            test = test[0];
            const fields = {
                name: 'Luis'
            };
            const File = await FileController.update(test._id, fields);
            expect(File).to.not.be.undefined;
            expect(File.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const File = await FileController.update(mongoose.Types.ObjectId('111111111111'), fields);
            expect(File).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            let test = await FileController.getAll();
            test = test[0];
            const File = await FileController.delete(test._id);
            expect(File).to.not.be.undefined;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.File.drop();
    mongoose.connection.close();
});
