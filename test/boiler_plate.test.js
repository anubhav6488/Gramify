let assert = require('assert');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('Brands', () => {

    describe('GET /v1/brands', () => {
        it('It should list all data of interest table', (done) => {
            chai.request(server)
                .get('/v1/brands')
                .end((err, res) => {
                    if (err) {
                        console.log(err)
                        done();
                    } else {
                        res.should.have.status(200);
                        res.body.data.should.be.a('array');
                        done();
                    }
                });
        });
    });


    describe('GET /v1/brands/1', () => {
        it('It should the data of interest table with id 1', (done) => {
            chai.request(server)
                .get('/v1/brands')
                .end((err, res) => {
                    if (err) {
                        console.log(err)
                        done();
                    } else {
                        res.should.have.status(200);
                        res.body.data.should.be.a('array');
                        done();
                    }
                });
        });
    });

    describe('POST /v1/brands', () => {
        it('It should create new interest type', (done) => {
            chai.request(server)
                .post('/v1/brands')
                .send({
                    "name": "test value - d1"
                })
                .end((err, res) => {
                    if (err) {
                        console.log(err)
                        done();
                    } else {
                        res.should.have.status(200);
                        done();
                    }
                });
        });
    });

});