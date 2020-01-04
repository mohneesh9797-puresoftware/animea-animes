const Anime = require('../src/models/anime.model');
const mongoose = require('mongoose');
const db = require('../db');

describe('Animes DB connection', () => {
    beforeAll(() => {
        return db.connect();
    })

    it('inserts an anime in the user list in db', (done) => {
        const anime = new Anime({anime_id: 7442, user_id: '1', rating: 2, status: 'pending'});
        anime.save((err, anime) => {
            expect(err).toBeNull();
            Anime.find({}, (err, animes) => {
                expect(animes.length).toEqual(1);
                done();
            });
        });
    });

    it('updates an anime in the user list in db', (done) => {
        const userAnimeIds = {anime_id: 7442, user_id: 1};
        const updatedAnime = {rating: 4, status: 'finished'};
        Anime.findOneAndUpdate(userAnimeIds, updatedAnime, function () {
            Anime.find({}, (err, animes) => {
                expect(animes.length).toEqual(1);
                expect(animes[0].rating).toEqual(4);
                expect(animes[0].status).toEqual('finished');
                console.log(animes)
                done();
          });
        });
    });

    it('deletes an anime from the user list in db', (done) => {
        const anime = {anime_id: 7442, user_id: 1};
        Anime.findOneAndRemove(anime, (err) => {
            expect(err).toBeNull();
            Anime.find({}, (err, animes) => {
                expect(animes.length).toEqual(0);
                done();
            });
        });
    });

    afterAll((done) => {
        mongoose.connection.close(done);
    });

})