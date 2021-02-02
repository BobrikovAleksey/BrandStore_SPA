import { ConfigNames, Mutations, PriceTypes } from '@/store/dictionary';

const catalogUrl = '/api/catalog';

/**
 * @param commit
 * @param data
 */
const checkConfigSize = ({ commit }, data) => {
  commit(Mutations.Catalog.SET_CONFIG_SIZE, data);
};

/**
 * @param commit
 * @param data
 */
const checkConfigTrending = ({ commit }, data) => {
  commit(Mutations.Catalog.SET_CONFIG_TRENDING, data);
};

/**
 * Запрашивает требуемый параметр для выборки
 * @param commit
 * @param name {string}
 * @param query {string}
 */
const fetchConfig = ({ commit }, { name, query }) => {
  commit(Mutations.Catalog.SET_LOADING, true);
  commit(Mutations.Catalog.SET_RESPONSE, false);

  fetch(`${catalogUrl}/${name}/?${query}`)
    .then((response) => response.json())
    .then((data) => {
      commit(Mutations.Catalog.SET_RESPONSE, true);

      switch (name) {
        case ConfigNames.categories:
          commit(Mutations.Catalog.SET_CONFIG_CATEGORIES, data);
          break;

        case ConfigNames.brands:
          commit(Mutations.Catalog.SET_CONFIG_BRANDS, data);
          break;

        case ConfigNames.colors:
          commit(Mutations.Catalog.SET_CONFIG_COLORS, data);
          break;

        default:
          commit(Mutations.Catalog.SET_RESPONSE, false);
      }

      commit(Mutations.Catalog.SET_LOADING, false);
    })
    .catch(() => {
      commit(Mutations.Catalog.SET_RESPONSE, false);
      commit(Mutations.Catalog.SET_LOADING, false);
      // сообщение об ошибке
    });
};

/**
 * Запрашивает каталог с сервера
 * @param commit
 * @param getters
 * @param query {string}
 */
const fetchData = ({ commit, getters }, query) => {
  commit(Mutations.Catalog.SET_LOADING, true);
  commit(Mutations.Catalog.SET_RESPONSE, false);

  fetch(`${catalogUrl}/?${query}`)
    .then((response) => response.json())
    .then((data) => {
      commit(Mutations.Catalog.SET_RESPONSE, true);
      commit(Mutations.Catalog.SET_DATA, data);
      commit(Mutations.Catalog.SET_VIEW_PAGE, 1);
      commit(Mutations.Catalog.SET_CONFIG_PRICE_VALUE_MIN, getters.getPriceInterval.min);
      commit(Mutations.Catalog.SET_CONFIG_PRICE_VALUE_MAX, getters.getPriceInterval.max);
      commit(Mutations.Catalog.SET_LOADING, false);
    })
    .catch(() => {
      commit(Mutations.Catalog.SET_RESPONSE, false);
      commit(Mutations.Catalog.SET_LOADING, false);
      // сообщение об ошибке
    });
};

/**
 * @param commit
 * @param type {string}
 * @param value {number}
 */
const setConfigPriceValue = ({ commit }, { type, value }) => {
  if (type === PriceTypes.min) {
    commit(Mutations.Catalog.SET_CONFIG_PRICE_VALUE_MIN, value);
  } else if (type === PriceTypes.max) {
    commit(Mutations.Catalog.SET_CONFIG_PRICE_VALUE_MAX, value);
  }
};

/**
 * @param commit
 * @param list {string[]}
 */
const setConfigSearch = ({ commit }, list) => {
  commit(Mutations.Catalog.SET_CONFIG_SEARCH, list);
};

/**
 * @param commit
 * @param value {number}
 */
const setViewQuantity = ({ commit }, value) => {
  commit(Mutations.Catalog.SET_VIEW_QUANTITY, value);
};

/**
 * @param commit
 * @param value {number}
 */
const setViewPage = ({ commit }, value) => {
  commit(Mutations.Catalog.SET_VIEW_PAGE, value);
};

/**
 * @param commit
 * @param value {number}
 */
const setViewSortBy = ({ commit }, value) => {
  commit(Mutations.Catalog.SET_VIEW_SORT_BY, value);
};

/**
 * @param commit
 * @param id {number}
 * @param name {ConfigNames}
 */
const switchConfig = ({ commit }, { id, name }) => {
  switch (name) {
    case ConfigNames.categories:
      commit(Mutations.Catalog.SWITCH_CONFIG_CATEGORIES, { id, name });
      break;

    case ConfigNames.brands:
      commit(Mutations.Catalog.SWITCH_CONFIG_BRANDS, id);
      break;

    case ConfigNames.colors:
      commit(Mutations.Catalog.SWITCH_CONFIG_COLORS, id);
      break;

    default:
      // do nothing
  }
};

export default {
  checkConfigSize,
  checkConfigTrending,
  fetchConfig,
  fetchData,
  setConfigPriceValue,
  setConfigSearch,
  setViewQuantity,
  setViewPage,
  setViewSortBy,
  switchConfig,
};
