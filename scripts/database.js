const fs = require('fs');
const lib = require('./library');

const catalogUrl = './database/catalog.json';
const reviewsUrl = './database/reviews.json';
const regionsUrl = './database/regions.json';
const citiesUrl = './database/cities.json';

const db = {};

/**
 * Открывает таблицу из файла
 *
 * @param err {Error|null}
 * @param data {string}
 * @returns {{result: number, data: object, list: array, message: string|Error}}
 * @private
 */
const _openTable = (err, data) => {
  if (err) {
    return {
      data: {},
      list: [],
      result: 0,
      message: err,
    }
  }

  return {
    data: lib.jsonParse(data) ?? {},
    list: Object.values(lib.jsonParse(data.toLowerCase()) ?? {}),
    result: 1,
    message: 'Success',
  };
};


fs.readFile(catalogUrl, 'utf-8', function(err, data) {
  db.catalog = _openTable(err, data);
});

fs.readFile(reviewsUrl, 'utf-8', function(err, data) {
  db.reviews = _openTable(err, data);
});

fs.readFile(regionsUrl, 'utf-8', function(err, data) {
  db.regions = _openTable(err, data);
});

fs.readFile(citiesUrl, 'utf-8', function(err, data) {
  db.cities = _openTable(err, data);
});


module.exports = db;
