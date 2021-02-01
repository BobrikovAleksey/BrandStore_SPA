const fs = require('fs');
const lib = require('./library');
const cart = require('./cart');


const actions = {
  'cart.add': cart.add,
  'cart.change': cart.change,
  'cart.delete': cart.del,
  'cart.clear': cart.clear,
};


/**
 * Добавляет, изменяет и удаляет записи в файле
 *
 * @param request {Request}
 * @param response {Response}
 * @param action {string}
 * @param filepath {string}
 */
const handler = (request, response, action, filepath) => {
  if (!actions[action]) {
    response.sendStatus(404).send(JSON.stringify({
      result: 0,
      message: `Handler [${action}]: There is not such action`,
    }));
    return;
  }

  fs.readFile(filepath, 'utf-8', (err, data) => {
    if (err) {
      response.sendStatus(404).send(JSON.stringify({result: 0, message: err}));
      return;
    }

    fs.writeFile(filepath, actions[action](lib.jsonParse(data), request), (err) => {
        if (err) response.send(`{"result": 0, "message": ${err}}`);

        else response.send(`{"result": 1, "message": "Handler [${action}]: File was updated"}`);
      });
  });
};


module.exports = handler;
