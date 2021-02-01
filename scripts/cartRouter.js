const express = require('express');
const router = express.Router();
const fs = require('fs');
const lib = require('./library');
const db = require('./database');
const handler = require('./handler');

const cartUrl = './database/cart-user.json';

const ADD = 'cart.add';
const CHANGE = 'cart.change';
const DELETE = 'cart.delete';
const CLEAR = 'cart.clear';


/**
 * Возвращает товары из корзины
 */
router.get('/', (request, response) => {
  if (!db.catalog) {
    response.sendStatus(404, '{"result": -1, "message": "Try again request later"}');
    return;
  }

  if (db.catalog.result === 0) {
    response.sendStatus(404, JSON.stringify(db.catalog));
    return;
  }

  fs.readFile(cartUrl, 'utf-8', (err, data) => {
    if (err) {
      response.sendStatus(404, JSON.stringify({ result: 0, message: err }));
      return;
    }

    const cart = lib.jsonParse(data) ?? [];
    for (let i = 0; i < cart.length; i++) {
      cart[i].product = db.catalog.data[String(cart[i].id)];
    }

    response.send(JSON.stringify(cart));
  });
});


/**
 * Добавляет новый товар в корзину
 */
router.post('/', (request, response) => {
  handler(request, response, ADD, cartUrl);
});


/**
 * Добавляет товар в корзину
 */
router.put('/', (request, response) => {
  handler(request, response, CHANGE, cartUrl);
});


/**
 * Убирает товар из корзины
 */
router.delete('/', (request, response) => {
  handler(request, response, DELETE, cartUrl);
});


/**
 * Очищает корзину
 */
router.delete('/clear', (request, response) => {
  handler(request, response, CLEAR, cartUrl);
});


module.exports = router;
