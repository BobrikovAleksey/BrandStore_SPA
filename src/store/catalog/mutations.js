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

/**
 * @param state
 * @param catalog {object[]}
 */
const SET_DATA = (state, catalog) => {
  state.list = [...catalog];
};

/** ***********************************************
 *  C O N F I G                                   *
 ************************************************ */

/**
 * @param state
 * @param data
 */
const SET_CONFIG_BRANDS = (state, data) => {
  const newData = [];
  for (let i = 0; i < data.length; i++) {
    newData.push({
      id: i + 1,
      flag: false,
      title: data[i],
    });
  }

  state.config.brands = [...newData];
};

/**
 * @param state
 * @param data
 */
const SET_CONFIG_CATEGORIES = (state, data) => {
  const newData = [];

  for (let k = 0; k < data.length; k++) {
    const list = [];
    for (let i = 0; i < data[k].categories.length; i++) {
      list.push({
        id: i + 1,
        flag: false,
        title: data[k].categories[i],
      });
    }

    newData.push({
      id: k + 1,
      categories: list,
      flag: false,
      type: data[k].type,
    });
  }

  state.config.categories = [...newData];
};

/**
 * @param state
 * @param data
 */
const SET_CONFIG_COLORS = (state, data) => {
  const newData = [];
  for (let i = 0; i < data.length; i++) {
    newData.push({ id: i + 1, ...data[i], flag: false });
  }

  state.config.colors = [...newData];
};

/**
 * @param state
 * @param value {number}
 */
const SET_CONFIG_PRICE_VALUE_MIN = (state, value) => {
  state.config.price.min = value;
};

/**
 * @param state
 * @param value {number}
 */
const SET_CONFIG_PRICE_VALUE_MAX = (state, value) => {
  state.config.price.max = value;
};

/**
 * @param state
 * @param list {array}
 */
const SET_CONFIG_SEARCH = (state, list) => {
  state.config.search = [...list];
};

/**
 * @param state
 * @param data
 */
const SET_CONFIG_SIZE = (state, data) => {
  const item = state.config.size.find((el) => el.id === data.id);

  item.flag = data.flag;
};

/**
 * @param state
 * @param data
 */
const SET_CONFIG_TRENDING = (state, data) => {
  const item = state.config.trending.find((el) => el.id === data.id);

  item.flag = data.flag;
};

/**
 * @param state
 * @param id {number}
 */
const SWITCH_CONFIG_BRANDS = (state, id) => {
  const brand = state.config.brands.find((el) => el.id === id);

  brand.flag = !brand.flag;
};

/**
 * @param state
 * @param params
 */
const SWITCH_CONFIG_CATEGORIES = (state, params) => {
  const type = state.config.categories.find((el) => el.id === params.type);
  const category = type.categories.find((el) => el.id === params.category);

  category.flag = !category.flag;

  let flag = false;
  for (let i = 0; i < type.categories.length; i++) {
    if (type.categories[i].flag) {
      flag = true;
      break;
    }
  }

  type.flag = flag;
};

/**
 * @param state
 * @param id {number}
 */
const SWITCH_CONFIG_COLORS = (state, id) => {
  const color = state.config.colors.find((el) => el.id === id);

  color.flag = !color.flag;
};

/** ***********************************************
 *  V I E W                                       *
 ************************************************ */

/**
 * @param state
 * @param value {number}
 */
const SET_VIEW_PAGE = (state, value) => {
  state.view.page = value;
};

/**
 * @param state
 * @param value {number}
 */
const SET_VIEW_QUANTITY = (state, value) => {
  const k = (state.view.quantity / value) * state.view.page;

  state.view.quantity = value;
  state.view.page = Math.ceil(Math.min(k, state.list.length / value));
};

/**
 * @param state
 * @param value
 */
const SET_VIEW_SORT_BY = (state, value) => {
  state.view.sortBy = value;
};

export default {
  SET_LOADING,
  SET_RESPONSE,
  SET_DATA,
  // config
  SET_CONFIG_BRANDS,
  SET_CONFIG_CATEGORIES,
  SET_CONFIG_COLORS,
  SET_CONFIG_PRICE_VALUE_MIN,
  SET_CONFIG_PRICE_VALUE_MAX,
  SET_CONFIG_SEARCH,
  SET_CONFIG_SIZE,
  SET_CONFIG_TRENDING,
  SWITCH_CONFIG_BRANDS,
  SWITCH_CONFIG_CATEGORIES,
  SWITCH_CONFIG_COLORS,
  // view
  SET_VIEW_PAGE,
  SET_VIEW_QUANTITY,
  SET_VIEW_SORT_BY,
};
