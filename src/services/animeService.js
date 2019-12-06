'use strict';

var request = require("request");
var utils = require("../utils");
class AnimeService {
    static getAnimes(page, filters) {
        const API_PATH = process.env.API_PATH;
        var options = {
            url: utils.createUrl(page, filters),
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            }
        };
        return new Promise(function (resolve, reject) {
            request.get(options, (err, response, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(response.body));
                }
            })
        });
    }

    static getAnimeById(id) {
        const API_PATH = process.env.API_PATH;
        var options = {
            url: `${API_PATH}/anime?filter[id]=${id}`,
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            }
        };
        return new Promise(function (resolve, reject) {
            request.get(options, (err, response, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(response.body));
                }
            })
        });
    }
}

module.exports = AnimeService;
