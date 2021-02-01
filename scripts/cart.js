/**
 * Сравнивает два элемента корзины по id и размеру
 *
 * @param dataA {{ id: number, data: { size: number|string }}}
 * @param dataB {{ id: number, data: { size: number|string }}}
 * @returns {boolean}
 */
const compare = (dataA, dataB) => {
  return dataA.id === dataB.id && dataA.data.size === dataB.data.size
};


/**
 * Добавляет новый товар в корзину
 *
 * @param list {array} - список товаров в корзине
 * @param product {{id: number, data: { size: number|string, quantity: number }}}
 * @returns {string}
 */
const add = (list, product) => {
  if (!Array.isArray(list)) return '[]';

  const i = list.findIndex((el) => compare(el, product));

  if (i < 0) {
    list.push(product);
  } else {
    list[i].data.quantity += product.data.quantity;
  }

  return JSON.stringify(list, null, 2);
};


/**
 * Добавляет определенное количество уже находящегося в корзине товара
 *
 * @param list {array} - список товаров в корзине
 * @param product {{id: number, data: { size: number|string, quantity: number }}}
 * @returns {string}
 */
const change = (list, product) => {
  if (!Array.isArray(list)) return '[]';

  const i = list.findIndex((el) => compare(el, product));

  if (i >= 0) {
    list[i].data.quantity += product.data.quantity;
  } else {
    list.push(product);
  }

  return JSON.stringify(list, null, 2);
};


/**
 * Убирает определенное количество находящегося в корзине товара, если после изменения количество товара становится
 * отрицательным, он удаляется из корзины
 *
 * @param list {array} - список товаров в корзине
 * @param product {{id: number, data: { size: number|string, quantity: number }}}
 * @returns {string}
 */
const del = (list, product) => {
  if (!Array.isArray(list)) return '[]';

  const i = list.findIndex((el) => compare(el, product));

  if (i >= 0) {
    list[i].data.quantity -= product.data.quantity;
    if (list[i].data.quantity < 0) list.splice(i, 1);
  }

  return JSON.stringify(list, null, 2);
};


/**
 * Полностью очищает корзину
 *
 * @returns {string}
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
