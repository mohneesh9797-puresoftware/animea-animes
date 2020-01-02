const chai = require("chai");
const request = require('supertest');
const mongoose = require('../db.js');
const app = require('../src/server');
const nock = require('nock');
const kitsuResponses = require('./kitsuResponses');

const assert = chai.assert;
const expect = chai.expect;

beforeEach(() => {
    nock('https://kitsu.io')
        .get('/api/edge/anime?sort=popularityRank&page[limit]=10&page[offset]=0')
        .reply(200, kitsuResponses.getAllAnimes)
        .get('/api/edge/anime?sort=popularityRank&page[limit]=10&page[offset]=0&filter[genres]=school')
        .reply(200, kitsuResponses.getAnimesByGenre)
        .get('/api/edge/anime?filter[id]=207')
        .reply(200, kitsuResponses.getAnimeById)
});

describe("Get all animes", () => {
    it('Should return a list of 10 animes', (done) => {
        request(app)
            .get('/animes')
            .expect(response => {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body).to.have.length(10)
            })
            .expect(200, done);
    });
});

describe("Get anime by id", () => {
    it('Should return Cardcaptor Sakura anime', (done) => {
        request(app)
            .get('/animes/207')
            .expect(response => {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body[0].attributes.titles.en).to.be.equal("Cardcaptor Sakura")
            })
            .expect(200, done);
    });
});

describe("Get anime by genre", () => {
    it('Should return only animes with school genre', (done) => {
        request(app)
            .get('/animes?genres=school')
            .expect(response => {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body[0].attributes.titles.en).to.be.equal("My Hero Academia")
                expect(response.body[9].attributes.titles.en).to.be.equal("Food Wars! Shokugeki no Soma")
            })
            .expect(200, done);
    });
});

describe("Get anime by wrong filter", () => {
    it('Should return a list of 10 animes unfiltered', (done) => {
        request(app)
            .get('/animes?wrongFilter=wrongFilterValue')
            .expect(response => {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body).to.have.length(10)
            })
            .expect(200, done);
    });
});

describe("POST /anime", () => {
    const anime = {user_id: '1', rating: '2', status: 'pending'}

    it('Should add a new anime to users list', (done) => {
        return request(app).post('/user/animes/7442').send(anime).then((response) => {
            expect(response.statusCode).to.be.equal(201);
            expect(response.body).to.have.length(10);
        }).expect(201, done());
    });
});

describe("PUT /anime", () => {
    const anime = {user_id: '1', rating: '4', status: 'watching'}

    it('Should update an users anime', (done) => {
        return request(app).put('/user/animes/7442').send(anime).then((response) => {
            expect(response.statusCode).to.be.equal(200);
            expect(response.body).to.have.length(10);
        }).expect(200, done());
    })
})

describe("DELETE /anime", () => {

    it('Should delete an anime from user list', (done) => {
        return request(app).delete('/user/animes/7442').expect(response => {
            expect(response.statusCode).to.be.equal(200)
            console.log("HOLA")
        }).expect(200, done());
    });
});