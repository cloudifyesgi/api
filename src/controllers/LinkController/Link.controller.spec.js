'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let LinkController;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    LinkController = require('./Link.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('Link Controller', () => {
    describe('#create()', () => {
        it('should return new Link', async () => {
            const Link = await LinkController.create('string','string','2019-04-20',true,'string');
            expect(Link).to.not.be.undefined;
        });
    });
    describe('#getAll()', () => {
        it('should return Link array', async () => {
            const Links = await LinkController.getAll();
            expect(Links).to.be.an('array');
            expect(Links).to.have.length(1);
        });
    });

    describe('#getById()', () => {
        it('should return an Link', async () => {
            let test = await LinkController.getAll();
            test = test[0];
            const Link = await LinkController.getById(test._id);
            expect(Link).to.not.be.null;
        });

        it('should return undefined', async () => {
            const Link = await LinkController.getById(mongoose.Types.ObjectId('111111111111'));
            expect(Link).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return Link updated', async () => {
            let test = await LinkController.getAll();
            test = test[0];
            const fields = {
                name: 'Luis'
            };
            const Link = await LinkController.update(test._id, fields);
            expect(Link).to.not.be.undefined;
            expect(Link.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const Link = await LinkController.update(mongoose.Types.ObjectId('111111111111'), fields);
            expect(Link).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            let test = await LinkController.getAll();
            test = test[0];
            const Link = await LinkController.delete(test._id);
            expect(Link).to.not.be.undefined;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.Link.drop();
    mongoose.connection.close();
});
