/**
 * @param state
 * @param product
 */
const ADD_PRODUCT = (state, product) => {
  state.list.push(product);
};

/**
 * @param state
 */
const CLEAR = (state) => {
  state.list = [];
};

/**
 * @param state
 * @param index {number}
 * @param data
 */
const INC_PRODUCT = (state, { index, product }) => {
  state.list[index].data.quantity += product.data.quantity;
};

/**
 * @param state
 * @param index {number}
 * @param product
 */
const REMOVE_PRODUCT = (state, { index, product }) => {
  state.list[index].data.quantity -= product.product.quantity;

  if (state.list[index].data.quantity < 0) {
    state.list.splice(index, 1);
  }
};

/**
 * @param state
 * @param productList {object[]}
 */
const SET_DATA = (state, productList) => {
  state.list = [...productList];
};

/**
 * @param state
 * @param loading {boolean}
 */
const SET_LOADING = (state, loading) => {
  state.loading = loading;
};

/**
 * @param state
 * @param response {boolean}
 */
const SET_RESPONSE = (state, response) => {
  state.response = response;
};

export default {
  ADD_PRODUCT,
  CLEAR,
  INC_PRODUCT,
  REMOVE_PRODUCT,
  SET_DATA,
  SET_LOADING,
  SET_RESPONSE,
};
