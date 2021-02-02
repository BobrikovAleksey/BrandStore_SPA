import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
  namespaced: true,
  state: {
    config: {
      brands: null,
      categories: null,
      colors: null,
      price: {
        min: null,
        max: null,
      },
      search: [],
      size: [
        { id: 1, label: 'XXS', flag: false },
        { id: 2, label: 'XS', flag: false },
        { id: 3, label: 'S', flag: false },
        { id: 4, label: 'M', flag: false },
        { id: 5, label: 'L', flag: false },
        { id: 6, label: 'XL', flag: false },
        { id: 7, label: 'XXL', flag: false },
      ],
      trending: [
        { id: 1, label: 'Bohemian', flag: false },
        { id: 2, label: 'Floral', flag: false },
        { id: 3, label: 'Lace', flag: false },
        { id: 4, label: 'Floral', flag: false },
        { id: 5, label: 'Lace', flag: false },
        { id: 6, label: 'Bohemian', flag: false },
      ],
    },
    list: [],
    loading: false,
    response: false,
    view: {
      page: 1,
      quantity: 9,
      sortBy: 'title asc',
    },
  },
  mutations,
  actions,
  getters,
};
