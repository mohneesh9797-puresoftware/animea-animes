'use strict';

const request = require('request');
const utils = require('../utils');
const AnimeModel = require('../models/anime.model');

class AnimeService {
  static getAnimes(page, filters) {
    const options = {
      url: utils.createUrl(page, filters),
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    };
    return new Promise(function (resolve, reject) {
      request.get(options, (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(response.body));
        }
      });
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
    return new Promise(function (resolve, reject) {
      request.get(options, (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(response.body));
        }
      });
    });
  }

  static getUserAnimesById(userId) {
    return new Promise(function (resolve, reject) {
      AnimeModel.find({
        user_id: userId,
      })
        .then((doc) => {
          var userAnimes = []   
          for (var i = 0; i < doc.length; i++){
            var userAnime = doc[i]
            userAnimes.push(AnimeService.getAnimeById(userAnime.anime_id))
          }
          Promise.all(userAnimes).then((response) => {
            resolve(response.map(x => x.data[0]));
          })
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteUserAnimeById(animeId) {
    return new Promise(function (resolve, reject) {
      AnimeModel.remove({
        anime_id: animeId
      }, function (err, docs) {
        resolve();
      });
    });
  }

  static postUserNewAnime(anime) {
    return new Promise(function (resolve, reject) {
      AnimeModel.create({
        'status': anime.status,
        'rating': anime.rating
      },anime, function () {
        resolve();
      });
    });
  }

  static updateUserAnimeById(anime) {
    return new Promise(function (resolve, reject) {
      AnimeModel.update({
        'anime_id': anime.anime_id
      }, anime, function () {
        resolve();
      });
    });
  }
}

module.exports = AnimeService;
