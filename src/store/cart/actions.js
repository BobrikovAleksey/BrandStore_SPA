import { Mutations } from '@/store/dictionary';

const cartUrl = '/api/cart';

/**
 * Возвращает позицию продукта в корзине
 * @param product
 * @param cart
 * @returns {*}
 */
const findProduct = (product, cart) => {
  const compare = (p, c) => p.id === c.id && p.data.size === c.data.size;

  return cart.findIndex((el) => compare(el, product));
};

/**
 * Добавляет товар в корзину
 * @param state
 * @param commit
 * @param product
 * @returns {Promise<void>}
 */
const add = ({ state, commit }, product) => {
  const index = findProduct(product, state.list);

  return fetch(cartUrl, {
    method: index < 0 ? 'POST' : 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: product.id,
      data: { size: product.data.size, quantity: product.data.quantity },
    }),
  })
    .then(() => {
      if (index < 0) {
        commit(Mutations.Cart.ADD_PRODUCT, product);
      } else {
        commit(Mutations.Cart.INC_PRODUCT, product);
      }
    })
    .catch(() => {
      // сообщение об ошибке
    });
};

/**
 * Очищает корзину
 * @param commit
 * @returns {Promise<void>}
 */
const clear = ({ commit }) => fetch(`${cartUrl}/clear`, {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
})
  .then(() => {
    commit(Mutations.Cart.CLEAR);
  })
  .catch(() => {
    // сообщение об ошибке
  });

/**
 * Запрашивает состояние корзины с сервера
 * @param commit
 */
const fetchData = ({ commit }) => {
  commit(Mutations.Cart.SET_LOADING, true);
  commit(Mutations.Cart.SET_RESPONSE, false);

  fetch(cartUrl)
    .then((response) => response.json())
    .then((data) => {
      commit(Mutations.Cart.SET_RESPONSE, true);
      commit(Mutations.Cart.SET_DATA, data);
      commit(Mutations.Cart.SET_LOADING, false);
    })
    .catch(() => {
      commit(Mutations.Cart.SET_RESPONSE, false);
      commit(Mutations.Cart.SET_LOADING, false);
      // сообщение об ошибке
    });
};

/**
 * Убирает товар из корзины
 * @param commit
 * @param product
 * @returns {Promise<void>}
 */
const remove = ({ commit }, product) => fetch(cartUrl, {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: product.id,
    data: { size: product.data.size, quantity: product.data.quantity },
  }),
})
  .then(() => {
    commit(Mutations.Cart.REMOVE_PRODUCT, product);
  })
  .catch(() => {
    // сообщение об ошибке
  });

export default {
  add,
  clear,
  fetchData,
  remove,
};
