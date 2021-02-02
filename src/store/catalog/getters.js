import { CatalogFields, SortTypes } from '@/store/dictionary';

const getConfigBrands = (state) => state.config.brands;

const getConfigCategories = (state) => state.config.categories;

const getConfigColors = (state) => state.config.colors;

const getConfigSize = (state) => state.config.size;

const getConfigTrending = (state) => state.config.trending;

const filterBySize = (catalog, sizes) => {
  const checkedSizes = sizes.filter((el) => el.flag);
  if (checkedSizes.length === 0) return catalog;

  const sizeLabels = [];
  checkedSizes.forEach((el) => sizeLabels.push(el.label));

  return catalog.filter((el) => el[CatalogFields.size].findIndex((elem) => sizeLabels.includes(elem) >= 0));
};

const sortByField = (catalog, field, desc = false) => {
  switch (field) {
    default:
      catalog.sort((A, B) => A[CatalogFields.title].localeCompare(B[CatalogFields.title]));
      break;

    case SortTypes.popular:
      if (desc) catalog.sort((A, B) => B[CatalogFields.sold] - A[CatalogFields.sold]);
      else catalog.sort((A, B) => A[CatalogFields.sold] - B[CatalogFields.sold]);
      break;

    case SortTypes.rating:
      if (desc) catalog.sort((A, B) => B[CatalogFields.rating] - A[CatalogFields.rating]);
      else catalog.sort((A, B) => A[CatalogFields.rating] - B[CatalogFields.rating]);
      break;

    case SortTypes.price:
      if (desc) catalog.sort((A, B) => B[CatalogFields.price] - A[CatalogFields.price]);
      else catalog.sort((A, B) => A[CatalogFields.price] - B[CatalogFields.price]);
      break;

    case SortTypes.title:
      if (desc) catalog.sort((A, B) => B[CatalogFields.title].localeCompare(A[CatalogFields.title]));
  }
};

const getFilteredList = (state) => {
  let filterCatalog = state.list.filter((el) => el[CatalogFields.price] >= state.config.price.min
    && el[CatalogFields.price] <= state.config.price.max);

  filterCatalog = filterBySize(filterCatalog, state.config.size);

  const sortByAsArray = state.view.sortBy.split(' ');
  sortByField(filterCatalog, sortByAsArray[0], sortByAsArray[1] === SortTypes.desc);
  return filterCatalog;
};

const getList = (state) => state.list;

const getPage = (state) => state.view.page;

const getPriceInterval = (state) => {
  let min = state.list.length > 0 ? state.list[0].price : 0;
  let max = state.list.length > 0 ? state.list[0].price : 0;

  state.list.forEach((el) => {
    if (min > el.price) min = el.price;
    if (max < el.price) max = el.price;
  });

  return { size: max - min, min, max };
};

const getPriceValue = (state, getter) => {
  const percentMin = (state.config.price.min - getter.getPriceInterval.min) / getter.getPriceInterval.size;
  const percentMax = (state.config.price.max - getter.getPriceInterval.min) / getter.getPriceInterval.size;
  return {
    ...state.config.price,
    percentMin,
    percentMax,
  };
};

const getQuantity = (state) => state.view.quantity;

const getQuery = (state) => {
  const categories = [];
  if (state.config.categories) {
    state.config.categories.forEach((el) => el.categories.forEach((elem) => {
      if (elem.flag) categories.push(el.type + elem.title);
    }));
  }

  const brands = [];
  if (state.config.brands) {
    state.config.brands.forEach((el) => { if (el.flag) brands.push(el.title); });
  }

  const colors = [];
  if (state.config.colors) {
    state.config.colors.forEach((el) => { if (el.flag) colors.push(el.value); });
  }

  let query = '';
  if (state.config.search.length > 0) query += `filter=${JSON.stringify(state.config.search)}`;
  if (categories.length > 0) query += `${query.length > 0 ? '$' : ''}categories=${JSON.stringify(categories)}`;
  if (brands.length > 0) query += `${query.length > 0 ? '$' : ''}brands=${JSON.stringify(brands)}`;
  if (colors.length > 0) query += `${query.length > 0 ? '$' : ''}colors=${JSON.stringify(colors)}`;

  return query;
};

const getSearchList = (state) => state.config.search;

const getSortBy = (state) => state.view.sortBy;

const isEmpty = (state) => state.list.length === 0;

const isEmptyConfigBrands = (state) => !state.config.brands || state.config.brands.length === 0;

const isEmptyConfigColors = (state) => !state.config.colors || state.config.colors.length === 0;

const isCheckedConfigBrands = (state, getters) => {
  if (getters.isEmptyConfigBrands) return false;
  return state.config.brands.findIndex((el) => el.flag) >= 0;
};

const isCheckedConfigColors = (state, getters) => {
  if (getters.isEmptyConfigColors) return false;
  return state.config.colors.findIndex((el) => el.flag) >= 0;
};

export default {
  getConfigBrands,
  getConfigCategories,
  getConfigColors,
  getConfigSize,
  getConfigTrending,
  getFilteredList,
  getList,
  getPage,
  getPriceInterval,
  getPriceValue,
  getQuantity,
  getQuery,
  getSearchList,
  getSortBy,
  isEmpty,
  isEmptyConfigBrands,
  isEmptyConfigColors,
  isCheckedConfigBrands,
  isCheckedConfigColors,
};
