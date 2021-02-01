const express = require('express');
const router = express.Router();
const lib = require('./library');
const db = require('./database');

const CATALOG = 'catalog';
const CITIES = 'cities';
const REGIONS = 'regions';
const REVIEWS = 'reviews';

/**
 * Возвращает параметры из запроса
 *
 * @param page
 * @param collection
 * @param categories
 * @param brands
 * @param colors
 * @param filter
 * @param sortBy
 * @param quantity
 * @returns {{}}
 * @private
 */
const _getCatalogParams = ({ page, collection, categories, brands, colors, filter, sortBy, quantity }) => {
  const params = {};

  if (page) params.page = page.toLowerCase();
  if (collection) params.collection = collection.toLowerCase();
  if (categories) params.categories = lib.jsonParse(categories.toLowerCase()) ?? [];
  if (brands) params.brands = lib.jsonParse(brands.toLowerCase()) ?? [];
  if (colors) params.colors = lib.jsonParse(colors.toLowerCase()) ?? [];
  if (filter) params.filter = lib.jsonParse(filter.toLowerCase()) ?? [];
  if (sortBy) params.sortBy = lib.jsonParse(sortBy.toLowerCase()) ?? {};
  if (quantity) params.quantity = Number(quantity);

  return params;
}


/**
 * Фильтрует каталог по переданным параметрам
 *
 * @param data {array}
 * @param page
 * @param collection
 * @param brands
 * @param categories
 * @param colors
 * @param filter
 * @returns {[*]}
 * @private
 */
const _filterCatalog = (data, { page, collection, brands, categories, colors, filter } = {}) => {
  return data.filter((el) => {
    if (page && el.page !== page) return false;
    if (collection && el.collection !== collection) return false;
    if (categories && !categories.includes(`${el.type}|${el.category}`)) return false;
    if (brands && !brands.includes(el.brand)) return false;
    if (colors && !colors.includes(el.color.title) && !colors.includes(el.color.value)) return false;

    if (filter) {
      const strEl = JSON.stringify(el);

      for (let i = 0; i < filter.length; i++) {
        if (filter[i].length < 3) continue;

        if (!(new RegExp(filter[i], 'i')).test(strEl)) return false;
      }
    }

    return true;
  });
};


/**
 * Возвращает результат сравнения двух элементов для сортировки по возрастанию
 *
 * @param a {object}
 * @param b {object}
 * @param key {string}
 * @returns {number}
 * @private
 */
const _compareItemsAsc = (a, b, key) => {
  if (typeof b[key] === 'string') {
    const aKey = a[key];
    const bKey = b[key];

    return aKey.localeCompare(bKey);
  }

  return a[key] - b[key];
};


/**
 * Возвращает результат сравнения двух элементов для сортировки по убыванию
 *
 * @param a {object}
 * @param b {object}
 * @param key {string}
 * @returns {number}
 * @private
 */
const _compareItemsDesc = (a, b, key) => {
  if (typeof a[key] === 'string') {
    const aKey = a[key];
    const bKey = b[key];

    return bKey.localeCompare(aKey);
  }

  return b[key] - a[key];
};


/**
 *
 * @param tableName {string}
 * @param response {Response}
 * @returns {boolean}
 */
const _respondWithError = (tableName, response) => {
  let body = null;

  if (!db[tableName]) body = `{"result": -1, "message": "Table \"${tableName}]\": Try again request later"}`;
  else if (db[tableName].result === 0) body = JSON.stringify(db[tableName]);

  if (body) response.sendStatus(404, body);

  return Boolean(body);
}


/**
 * Возвращает список товаров
 */
router.get('/catalog', (request, response) => {
  if (_respondWithError(CATALOG, response)) return;

  const params = _getCatalogParams(request.query);
  const tmpData = _filterCatalog(db.catalog.list, params);

  const data = [];
  tmpData.forEach((el) => data.push(db.catalog.data[`${el.id}`]));

  if (params.sortBy) {
    const fields = Object.keys(params.sortBy);

    for (let i = fields.length - 1; i >= 0; i--) {
      switch (params.sortBy[fields[i]]) {
        default:
          data.sort((a, b) => _compareItemsAsc(a, b, fields[i]));
          break;

        case 'desc':
          data.sort((a, b) => _compareItemsDesc(a, b, fields[i]));
      }
    }
  }

  if (!isNaN(params.quantity) && params.quantity) {
    response.send(JSON.stringify(data.slice(0, params.quantity)));
    return;
  }

  response.send(JSON.stringify(data));
});


/**
 * Сортирует и возвращает только уникальные категории
 *
 * @param list {array}
 * @returns {string[]}
 */
const _selectDistinct = (list) => {
  list.sort((elA, elB) => typeof elB === "string" ? elA.localeCompare(elB) : elA - elB);

  return list.filter((el, i, list) => i > 0 ? el !== list[i-1] : true);
};


/**
 * Возвращает список доступных категорий товаров
 */
router.get('/catalog/categories', (request, response) => {
  if (_respondWithError(CATALOG, response)) return;

  const params = _getCatalogParams(request.query);
  const tmpData = _filterCatalog(db.catalog.list, params).map((el) => `${ el.type }|${ el.category }`);

  response.send(JSON.stringify(_selectDistinct(tmpData).map((el) => el.split('|'))));
});


/**
 * Возвращает список доступных брендов
 */
router.get('/catalog/brands', (request, response) => {
  if (_respondWithError(CATALOG, response)) return;

  const params = _getCatalogParams(request.query);
  const tmpData = _filterCatalog(db.catalog.list, params).map((el) => el.brand);

  response.send(JSON.stringify(_selectDistinct(tmpData)));
});


/**
 * Возвращает список доступных цветов
 */
router.get('/catalog/colors', (request, response) => {
  if (_respondWithError(CATALOG, response)) return;

  const params = _getCatalogParams(request.query);
  const tmpData = _filterCatalog(db.catalog.list, params).map((el) => `${el.color.title}|${el.color.value}`);

  response.send(JSON.stringify(_selectDistinct(tmpData).map((el) => el.split('|'))));
});


/**
 * Возвращает товар по указанному артикулу со всеми связанными товарами
 */
router.get('/product', (request, response) => {
  if (_respondWithError(CATALOG, response)) return;

  const id = request.query.id;

  let body = null;
  if (!id) body = '{result: 0, text: "Product ID is missing"}';
  if (!db.catalog.data[id]) body = `{result: 1, text: "Product ID:${id} is not at the catalog"}`;

  if (body) {
    response.sendStatus(404, body);
    return;
  }

  const result = [db.catalog.data[id]];
  const links = result[0].links;
  links.forEach((el) => result.push(db.catalog.data[String(el)]));

  response.send(JSON.stringify(result));
});


/**
 * Возвращает список отзывов
 */
router.get('/reviews', (request, response) => {
  if (_respondWithError(REVIEWS, response)) return;

  response.send(db.reviews.list);
});


/**
 * Возвращает список городов
 */
router.get('/lists/cities', (request, response) => {
  if (_respondWithError(CITIES, response)) return;

  response.send(db.cities.list);
});


/**
 * Возвращает список регионов
 */
router.get('/lists/regions', (request, response) => {
  if (_respondWithError(REGIONS, response)) return;

  response.send(db.regions.list);
});


module.exports = router;
