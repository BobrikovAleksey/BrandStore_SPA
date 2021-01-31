/**
 * Сравнивает два элемента корзины по артикулу и размеру
 *
 * @param dataA - объект со структурой { id, data: { size } }
 * @param dataB - объект со структурой { id, data: { size } }
 * @returns {boolean|boolean}
 */
const compare = (dataA, dataB) => {
  return dataA.id === dataB.id && dataA.data.size === dataB.data.size
};


/**
 * Добавляет новый товар в корзину
 *
 * @param list - список товаров в корзине
 * @param req - должен содержать body = { id, data: { size, quantity } }
 * @returns {string} - возвращает JSON-строку
 */
const add = (list, req) => {
  list.push(req.body);

  return JSON.stringify(list, null, 2);
};


/**
 * Добавляет определенное количество уже находящегося в корзине товара
 *
 * @param list - список товаров в корзине
 * @param req - должен содержать body = { id, data: { size, quantity } }
 * @returns {string} - возвращает JSON-строку
 */
const change = (list, req) => {
  const el = list.find((el) => compare(el, req.body));

  el.data.quantity += req.body.data.quantity;

  return JSON.stringify(list, null, 2);
};


/**
 * Убирает определенное количество находящегося в корзине товара, если после изменения количество товара становится
 * отрицательным, он удаляется из корзины
 *
 * @param list - список товаров в корзине
 * @param req - должен содержать body = { id, data: { size, quantity } }
 * @returns {string} - возвращает JSON-строку
 */
const del = (list, req) => {
  const i = list.findIndex((el) => compare(el, req.body));

  list[i].data.quantity -= req.body.data.quantity;
  if (list[i].data.quantity < 0) {
    list.splice(i, 1);
  }

  return JSON.stringify(list, null, 2);
};


/**
 * Полностью очищает корзину
 *
 * @returns {string} - возвращает JSON-строку
 */
const clear = () => {
  return JSON.stringify([], null, 2);
};


module.exports = {
  add,
  change,
  del,
  clear,
};
