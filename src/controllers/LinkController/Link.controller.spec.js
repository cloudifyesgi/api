'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let LinkController;
let Link;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    LinkController = require('./Link.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('Link Controller', () => {
    describe('#create()', () => {
        it('should return new Link', async () => {
            const Link = await LinkController.create(/**/);
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

            const Link = await LinkController.getById(/**/);
            expect(Link).to.not.be.undefined;
        });

        it('should return undefined', async () => {
            const Link = await LinkController.getById(/**/);
            expect(Link).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return Link updated', async () => {
            const fields = {
                name: 'Luis'
            };
            const Link = await LinkController.update(/**/, fields);
            expect(Link).to.not.be.undefined;
            expect(Link.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const Link = await LinkController.update(/**/, fields);
            expect(Link).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            const Link = await LinkController.delete(/**/);
            expect(Link).to.be.null;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.Link.drop();
    mongoose.connection.close();
});
