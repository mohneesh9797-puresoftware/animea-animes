'use strict';

const request = require('request');
const utils = require('../utils');
const AnimeModel = require('../models/anime.model');
const cache = require('memory-cache');

class AnimeService {
  static getAnimes(page, filters) {
    const options = {
      url: utils.createUrl(page, filters),
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    };

    var cachedBody = cache.get(options.url);
    return new Promise(function (resolve, reject) {
      if (!cachedBody) {
        request.get(options, (err, response, body) => {
          if (err) {
            reject(err);
          } else {
            var data = JSON.parse(response.body);
            cache.put(options.url, data, 86400000) // the cache will be stored 24h
            resolve(data);
          }
        });
      } else {
        console.log("Using cache...")
        resolve(cachedBody);
      }
    });
  }

  static getAnimeById(animeId) {
    const API_PATH = process.env.API_PATH;
    const options = {
      url: `${API_PATH}/anime?filter[id]=${animeId}`,
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    };
    var cachedBody = cache.get(options.url);
    return new Promise(function (resolve, reject) {
      if (!cachedBody) {
        request.get(options, (err, response, body) => {
          if (err) {
            reject(err);
          } else {
            var data = JSON.parse(response.body);
            cache.put(options.url, data, 86400000) // the cache will be stored 24h
            resolve(data);
          }
        });
      } else {
        console.log("Using cache...")
        resolve(cachedBody);
      }
    });
  }

  static getUserAnimesById(userId) {
    return new Promise(function (resolve, reject) {
        AnimeModel.find({
          user_id: userId,
        })
          .then((doc) => {
            const userAnimes = [];
            for (let i = 0; i < doc.length; i++) {
              const userAnime = doc[i];
              userAnimes.push(AnimeService.getAnimeById(userAnime.anime_id));
            }
            Promise.all(userAnimes).then((response) => {
              resolve(response.map((x, index) => {
                x = x.data[0];
                x.userData = doc[index];
                return x;
              }));
            });
          })
          .catch((err) => {
            reject(err);
          });
    });
  }

  static deleteUserAnimeById(animeId, userId) {
    return new Promise(function (resolve, reject) {
      AnimeModel.remove({
        anime_id: animeId,
      }, function (err, docs) {
        resolve();
      });
    });
  }

  static postUserNewAnime(anime) {
    return new Promise(function (resolve, reject) {
      AnimeModel.create({
        'anime_id': anime.anime_id,
        'status': anime.status,
        'rating': anime.rating,
      }, anime, function () {
        resolve();
      });
    });
  }

  static updateUserAnimeById(anime) {
    return new Promise(function (resolve, reject) {
      AnimeModel.update({
        'anime_id': anime.anime_id,
      }, anime, function () {
        resolve();
      });
    });
  }
}

module.exports = AnimeService;
