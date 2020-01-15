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

  static getAnimeById(animeId, userToken) {
    const API_PATH = process.env.API_PATH;
    const options = {
      url: `${API_PATH}/anime?filter[id]=${animeId}`,
      headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      },
    };

    return new Promise(function (resolve, reject) {
      request.get(`https://animea-gateway.herokuapp.com/auth/api/v1/auth/me`, { headers: { 'x-access-token': userToken } }, (err, response, bodyMaster) => {
        bodyMaster = JSON.parse(bodyMaster)
        if ('auth' in bodyMaster && !bodyMaster.auth) {
          console.log("NO HAY AUTH")
            request.get(options, (err, response, body) => {
              if (err) {
                reject(err);
              } else {
                var data = JSON.parse(response.body);
  
                AnimeModel.aggregate([
                  { "$group": {
                      "_id": animeId,
                      "avgRating": { "$avg": { "$ifNull": ["$rating",0 ] } },
                  }}
              ]).then((response) => {
                  data.data[0].animeaAverage = response[0].avgRating;
                  resolve(data);
                });
              }
            });
        } else {
            request.get(options, (err, response, body) => {
              if (err) {
                reject(err);
              } else {
                var data = JSON.parse(response.body);

                AnimeModel.aggregate([
                  { "$group": {
                      "_id": animeId,
                      "avgRating": { "$avg": { "$ifNull": ["$rating",0 ] } },
                  }}
                ]).then((response) => {
                  data.data[0].animeaAverage = response[0].avgRating;
                });
                AnimeModel.findOne({
                  anime_id: animeId, 
                  user_id: bodyMaster._id
                }).then((response) => {
                  if(response) {
                    data.data[0].status = response.status
                    data.data[0].rating = response.rating
                    data.data[0].userId = response.user_id
                    data.data[0].userHasAnime = true
                  } else {
                    data.data[0].userHasAnime = false
                  }
                    resolve(data);
                })
              }
            });
        }
      })
    });
    
    
  }

  static getUserAnimesById(userId, userToken) {
    console.log(`https://animea-gateway.herokuapp.com/auth/api/v1/auth/me`)

    return new Promise(function (resolve, reject) {
      request.get(`https://animea-gateway.herokuapp.com/auth/api/v1/auth/me`, { headers: { 'x-access-token': userToken } }, (err, response, body) => {
      console.log(body)
      body = JSON.parse(body)  
      if ('auth' in body && !body.auth) {
          reject(401)
        } else {
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
        }
      })
    });
  }

  static getFriendsForAnimeById(userId, animeId, userToken) {
    return new Promise(function (resolve, reject) {
      request.get(`https://animea-gateway.herokuapp.com/auth/api/v1/auth/me`, { headers: { 'x-access-token': userToken } }, (err, response, body) => {
        body = JSON.parse(body)
        if (('auth' in body && !body.auth) || body._id != userId) {
          reject(401)
        } else {
          request.get(`https://animea-gateway.herokuapp.com/friends/api/v1/users/${userId}/friends`, (err, response, body) => {
            if (err) {
              console.log('Error requesting friends...')
            } else {
              const friends = [];
              var body = JSON.parse(response.body)
              for (let i = 0; i < body.length; i++) {
                const friendId = body[i]._id;
                friends.push(AnimeModel.find({
                  user_id: friendId,
                  anime_id: animeId
                }));
              }
                Promise.all(friends).then((response) => {
                  resolve(response.map(x => {
                    for (let i = 0; i < body.length; i++){
                    var friendObj = body[i]; 
                      if(friendObj._id = x[0].user_id){
                        var friend = {
                          id: x[0].user_id,
                          username: friendObj.username,
                          profilePic: friendObj.profilePic}
                          return friend
                      }
                    }
                  }));
                });
              }
            })
        }
      })
    });
  }

  static deleteUserAnimeById(animeId, userId, userToken) {
    return new Promise(function (resolve, reject) {
      request.get(`https://animea-gateway.herokuapp.com/auth/api/v1/auth/me`, { headers: { 'x-access-token': userToken } }, (err, response, body) => {
      body = JSON.parse(body)  
      if (('auth' in body && !body.auth) || body._id != userId) {
          reject(401)
        } else {
      AnimeModel.findOneAndDelete({
        anime_id: animeId,
        user_id: userId
      }, function (err, docs) {
        if(docs){
          resolve();
        }else{
          reject(404);
        }
      });
    }});
    });
  }

  static postUserNewAnime(anime, userToken) {
    return new Promise(function (resolve, reject) {
      request.get(`https://animea-gateway.herokuapp.com/auth/api/v1/auth/me`, { headers: { 'x-access-token': userToken } }, (err, response, body) => {
      body = JSON.parse(body)  
      if (('auth' in body && !body.auth) || body._id != anime.user_id) {
          reject(401)
        } else {
      AnimeModel.create({
        'anime_id': anime.anime_id,
        'user_id': anime.user_id,
        'status': anime.status,
        'rating': anime.rating,
      }, function () {
        resolve();
      });
    }});
  });
  }

  static updateUserAnimeById(anime, userToken) {
    return new Promise(function (resolve, reject) {
      request.get(`https://animea-gateway.herokuapp.com/auth/api/v1/auth/me`, { headers: { 'x-access-token': userToken } }, (err, response, body) => {
      body = JSON.parse(body)  
      if (('auth' in body && !body.auth) || body._id != anime.user_id) {
          reject(401)
        } else {
      AnimeModel.findOneAndUpdate({
        anime_id: anime.anime_id,
        user_id: anime.user_id
      }, anime, function (err, docs) {
        if(docs){
          resolve();
        }else{
          reject(404);
        }
      });
    }});
    });
  }
}

module.exports = AnimeService;
