const fs = require('fs');
const express = require('express');
const router = express.Router();

const catalogUrl = './database/catalog.json';
const reviewUrl = './database/review.json';
const regionsUrl = './database/regions.json';
const citiesUrl = './database/cities.json';


/**
 * Преобразует строку в объект
 *
 * @param jsonString - преобразуемая строка
 * @returns {null|*} возвращает объект или "null"
 */
const parser = (jsonString) => {
  let result = null;

  try {
    result = JSON.parse(jsonString);
  } catch (err) {
    return result;
  }

  return result;
};


/**
 * Фильтрует каталог по выбранной странице и гендерному признаку
 *
 * @param query - запрос => pages: ['women', 'men', 'kids', 'accessories'],
 *                          collection: 'Женская коллекция' | 'Мужская ...' | 'Детская ...' | 'Коллекция аксессуаров'
 * @param data
 * @returns {*}
 */
const filterCatalog = (query, data) => {
  let page = null;
  let collection = null;

  const checkPage = (curPage) => {
    if (!page) return true;
    return curPage === page;
  };

  const checkCollection = (curCollection) => {
    if (!collection) return true;
    return curCollection === collection;
  };

  if ('page' in query) page = query.page;
  if ('collection' in query) collection = query.collection;

  let tmpData = JSON.parse(data);

  return tmpData.filter((el) => checkCollection(el.collection) && checkPage(el.page));
};


/**
 * Возвращает список товаров
 */
router.get('/catalog', (req, res) => {
  fs.readFile(catalogUrl, 'utf-8', (err, data) => {
    if (err) res.sendStatus(404, JSON.stringify({result: 0, text: err}));

    else {
      const params = {};

      if ('categories' in req.query) params.categories = parser(req.query.categories);
      if ('brands' in req.query) params.brands = parser(req.query.brands);
      if ('colors' in req.query) params.colors = parser(req.query.colors);
      if ('filter' in req.query) params.filter = parser(req.query.filter);
      if ('sortBy' in req.query) params.sortBy = parser(req.query.sortBy);
      if ('quantity' in req.query) params.quantity = +req.query.quantity;

      let newData = filterCatalog(req.query, data);

      if (params.categories) newData = newData.filter((el) => params.categories.includes(el.type + el.category));
      if (params.brands) newData = newData.filter((el) => params.brands.includes(el.brand));
      if (params.colors) newData = newData.filter((el) => params.colors.includes(el.color.value));

      if (params.filter) {
        newData = newData.filter((el) => {
          const strEl = JSON.stringify(el);

          for (let i = 0; i < params.filter.length; i++) {
            const regexp = new RegExp(params.filter[i], 'i');

            if (!regexp.test(strEl)) return false;
          }

          return true;
        });
      }

      for (const key in params.sortBy) {
        switch (params.sortBy[key].toLowerCase()) {
          case 'desc':
            newData.sort((a, b) => {
              if (typeof a[key] === "string") {
                const ak = a[key].toLowerCase();
                const bk = b[key].toLowerCase();

                return bk.localeCompare(ak);

              } else return b[key] - a[key];
            });
            break;

          default:
            newData.sort((a, b) => {
              if (typeof b[key] === 'string') {
                const ak = a[key].toLowerCase();
                const bk = b[key].toLowerCase();

                return ak.localeCompare(bk);

              } else return a[key] - b[key];
            });
        }
      }

      if (!isNaN(params.quantity) && params.quantity) {
        res.send(JSON.stringify(newData.slice(0, params.quantity)));

      } else res.send(JSON.stringify(newData));
    }
  });
});


/**
 * Сортирует и возвращает только уникальные строки
 *
 * @param data - массив строк
 * @returns {[]} - массив уникальных строк
 */
const selectDistinct = (data) => {
  let newData = data.sort((elA, elB) => typeof elB === "string" ? elA.localeCompare(elB) : elA - elB);

  return newData.filter((el, i, list) => i > 0 ? el !== list[i-1] : true);
};


/**
 * Возвращает список категорий товаров
 */
router.get('/catalog/categories', (req, res) => {
  fs.readFile(catalogUrl, 'utf-8', (err, data) => {
    if (err) res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    else {
      let newData = filterCatalog(req.query, data).map((el) => `${el.type}\n${el.category}`);

      newData = selectDistinct(newData);
      newData = newData.map((el) => {
        const obj = el.split(`\n`);

        return { type: obj[0], category: obj[1] };
      });

      const resData = [];

      for (let i = 0; i < newData.length; i++) {
        if (i === 0 || newData[i].type !== newData[i-1].type) {
          resData.push({ type: newData[i].type, categories: [newData[i].category] });

        } else {
          resData[resData.length-1].categories.push(newData[i].category);
        }
      }
      res.send(JSON.stringify(resData));
    }
  });
});


/**
 * Возвращает список брендов
 */
router.get('/catalog/brands', (req, res) => {
  fs.readFile(catalogUrl, 'utf-8', (err, data) => {
    if (err) res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    else {
      const newData = filterCatalog(req.query, data).map((el) => el.brand);

      res.send(JSON.stringify(selectDistinct(newData)));
    }
  });
});


/**
 * Возвращает список доступных цветов
 */
router.get('/catalog/colors', (req, res) => {
  fs.readFile(catalogUrl, 'utf-8', (err, data) => {
    if (err) res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    else {
      let newData = filterCatalog(req.query, data).map((el) => `${el.color.title}\n${el.color.value}`);

      newData = selectDistinct(newData);
      res.send(JSON.stringify(newData.map((el) => {
        const obj = el.split(`\n`);

        return { title: obj[0], value: obj[1] };
      })));
    }
  });
});


/**
 * Возвращает товар по указанному артикулу со всеми связанными товарами
 */
router.get('/product', (req, res) => {
  fs.readFile(catalogUrl, 'utf-8', (err, data) => {
    if (err) res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    else {
      if (!req.query.id) {
        res.sendStatus(404, JSON.stringify({result: 0, text: 'Товар отсутствует в каталоге'}));
        return;
      }

      data = JSON.parse(data);
      let newData = [data.find((el) => el.id === +req.query.id)];

      if (!newData[0]) {
        res.sendStatus(404, JSON.stringify({result: 0, text: 'Товар отсутствует в каталоге'}));
        return;
      }

      const links = newData[0].links;

      for (let i = 0; i < links.length; i++) {
        newData.push(data.find((el) => el.id === links[i]));
      }
      res.send(JSON.stringify(newData));
    }
  });
});


/**
 * Возвращает список отзывов
 */
router.get('/review', (req, res) => {
  fs.readFile(reviewUrl, 'utf-8', (err, data) => {
    if (err) res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
    else res.send(data);
  });
});


/**
 * Возвращает список регионов
 */
router.get('/lists/regions', (req, res) => {
  fs.readFile(regionsUrl, 'utf-8', (err, data) => {
    if (err) res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
    else res.send(data);
  });
});


/**
 * Возвращает список городов
 */
router.get('/lists/cities', (req, res) => {
  fs.readFile(citiesUrl, 'utf-8', (err, data) => {
    if (err) res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
    else res.send(data);
  });
});


module.exports = router;
