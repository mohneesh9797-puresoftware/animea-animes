const request = require('supertest');
const Anime = require('../src/models/anime.model');
const app = require('../src/server');
const nock = require('nock');
const kitsuResponses = require('./kitsuResponses');

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
                expect(response.statusCode).toBe(200)
                expect(response.body.length).toEqual(10)
            })
            .expect(200, done);
    });
});

describe("Get anime by id", () => {
    it('Should return Cardcaptor Sakura anime', (done) => {
        request(app)
            .get('/animes/207')
            .expect(response => {
                expect(response.statusCode).toBe(200)
                expect(response.body[0].attributes.titles.en).toBe("Cardcaptor Sakura")
            })
            .expect(200, done);
    });
});

describe("Get anime by genre", () => {
    it('Should return only animes with school genre', (done) => {
        request(app)
            .get('/animes?genres=school')
            .expect(response => {
                expect(response.statusCode).toBe(200)
                expect(response.body[0].attributes.titles.en).toBe("My Hero Academia")
                expect(response.body[9].attributes.titles.en).toBe("Food Wars! Shokugeki no Soma")
            })
            .expect(200, done);
    });
});

describe("Get anime by wrong filter", () => {
    it('Should return a list of 10 animes unfiltered', (done) => {
        request(app)
            .get('/animes?wrongFilter=wrongFilterValue')
            .expect(response => {
                expect(response.statusCode).toBe(200)
                expect(response.body.length).toEqual(10)
            })
            .expect(200, done);
    });
});

describe("POST /anime", () => {
    const anime = new Anime({user_id: '1', rating: '2', status: 'pending'});
    let dbInsert;
    beforeEach(() => {
        dbInsert = jest.spyOn(Anime, "create");
    });

    it('Should add a new anime to user list', () => {
        dbInsert.mockImplementation((anime, callback) => {
            callback(false);
        });
        return request(app).post('/user/animes/7442').send(anime).then((response) => {
            expect(response.statusCode).toBe(201);
            // expect(response).toBeCalledWith(objectToInsert, expect.any(Function));
        });
    });
});

describe("PUT /anime", () => {
    const animeId = {anime_id: 7442}
    const updatedAnime = new Anime({user_id: '1', rating: '4', status: 'pending'});
    let dbUpdate;
    beforeEach(() => {
        dbUpdate = jest.spyOn(Anime, "update");
    });

    it('Should add a new anime to user list', () => {
        dbUpdate.mockImplementation((animeId, updatedAnime, callback) => {
            callback(false);
        });
        return request(app).put('/user/animes/7442').send(updatedAnime).then((response) => {
            expect(response.statusCode).toBe(200);
            // expect(response).toBeCalledWith(objectToInsert, expect.any(Function));
        });
    });
});

describe("DELETE /anime", () => {
    const animeId = {anime_id: 7442, user_id: 1}
    let dbDelete;
    beforeEach(() => {
        dbDelete = jest.spyOn(Anime, "remove");
    });

    it('Should add a new anime to user list', () => {
        dbDelete.mockImplementation((animeId, callback) => {
            callback(false);
        });
        return request(app).delete('/user/animes/7442').send(animeId).then((response) => {
            expect(response.statusCode).toBe(200);
            // expect(response).toBeCalledWith(objectToInsert, expect.any(Function));
        });
    });
});